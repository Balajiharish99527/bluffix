import { db } from "@/db";
import { rooms, roomPlayers, games, rounds, roundPlayers, clues, votes, scores, users } from "@/db/schema";
import { CATEGORIES_DATA, INITIAL_WORDS, WordData } from "./words";
import { AiManager } from "./aiManager";
import { eq, and, sql } from "drizzle-orm";
import crypto from "crypto";

export interface PlayerState {
  userId: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  isBot: boolean; // Added bot flag
  score: number;
  lastSeenAt: number;
}

export interface ClueEntry {
  userId: string;
  name: string;
  avatar: string;
  turnIndex: number;
  text: string;
  timestamp: number;
}

export interface VoteEntry {
  voterUserId: string;
  voterName: string;
  suspectUserId: string;
  suspectName: string;
}

export interface ActiveGame {
  gameId: string;
  roundId: string;
  roundNumber: number;
  totalRounds: number;
  secretWord: string;
  secretWordTa: string;
  secretWordHi: string;
  liarQuestionNormal?: string;
  liarQuestionNormalTa?: string;
  liarQuestionNormalHi?: string;
  liarQuestionLiar?: string;
  liarQuestionLiarTa?: string;
  liarQuestionLiarHi?: string;
  status: "role_reveal" | "clue_turn" | "discussion" | "voting" | "vote_result" | "impostor_guess" | "round_result" | "game_over";
  playerRoles: Record<string, "civilian" | "impostor" | "liar">;
  clues: ClueEntry[];
  currentTurnUserId: string | null;
  turnIndex: number;
  timerExpiresAt: number | null;
  votes: Record<string, string>; // voterUserId -> suspectUserId
  revealedVotes: VoteEntry[] | null;
  suspectedUserId: string | null;
  isTie: boolean;
  impostorGuess: string | null;
  impostorGuessCorrect: boolean | null;
  roundWinnerTeam: "civilians" | "impostors" | null;
  roundPoints: Record<string, number>;
  roundSummaryMessage: string | null;
  overallWinnerUserIds?: string[];
  aiBriefing?: string;
  aiAnomalyName?: string | null;
  aiRoundRecap?: string | null;
  secureCommStream: { name: string, text: string }[];
}

export interface RoomState {
  id: string;
  code: string;
  hostUserId: string;
  status: "lobby" | "in_game" | "ended";
  settings: {
    gameMode: "classic" | "multi_impostor" | "find_liar";
    categoryId: string;
    difficulty: "easy" | "medium" | "hard";
    numRounds: number;
    currentRound: number;
    numImpostors: number;
    clueTimer: number;
    discussionTimer: number;
    votingTimer: number;
    maxPlayers: number;
    isAiMode: boolean;
  };
  players: PlayerState[];
  activeGame: ActiveGame | null;
  usedWords: string[];
  pastImpostors: string[]; // Track who has been the impostor to ensure fairness
  updatedAt: number;
}

// Global In-Memory Store for superfast multi-client syncing
// Persist across hot-reloads in development
const globalForRooms = globalThis as typeof globalThis & {
  __bluffixRooms?: Map<string, RoomState>;
};

const roomsMap = globalForRooms.__bluffixRooms ?? new Map<string, RoomState>();
globalForRooms.__bluffixRooms = roomsMap;

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getUUID(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export class RoomManager {
  public static getRoom(code: string): RoomState | null {
    const uppercaseCode = code.toUpperCase();
    return roomsMap.get(uppercaseCode) || null;
  }

  public static async createRoom(
    hostUserId: string,
    hostName: string,
    hostAvatar: string,
    settings?: Partial<RoomState["settings"]>
  ): Promise<RoomState> {
    let code = generateRoomCode();
    while (roomsMap.has(code)) {
      code = generateRoomCode();
    }

    const defaultSettings: RoomState["settings"] = {
      gameMode: settings?.gameMode || "classic",
      categoryId: settings?.categoryId || "food",
      difficulty: settings?.difficulty || "medium",
      numRounds: settings?.numRounds || 3,
      currentRound: 1,
      numImpostors: settings?.numImpostors || 1,
      clueTimer: settings?.clueTimer || 45,
      discussionTimer: settings?.discussionTimer || 60,
      votingTimer: settings?.votingTimer || 30,
      maxPlayers: settings?.maxPlayers || 8,
      isAiMode: settings?.isAiMode || false,
    };

    const hostPlayer: PlayerState = {
      userId: hostUserId,
      name: hostName,
      avatar: hostAvatar,
      isHost: true,
      isReady: true,
      isConnected: true,
      isBot: false,
      score: 0,
      lastSeenAt: Date.now(),
    };

    const room: RoomState = {
      id: getUUID(),
      code,
      hostUserId,
      status: "lobby",
      settings: defaultSettings,
      players: [hostPlayer],
      activeGame: null,
      usedWords: [],
      pastImpostors: [],
      updatedAt: Date.now(),
    };

    roomsMap.set(code, room);

    // Save initial room row to Postgres (Optional/Non-blocking)
    if (db) {
      db.insert(rooms).values({
        id: room.id,
        code: room.code,
        hostUserId: hostPlayer.userId,
        status: room.status,
        gameMode: room.settings.gameMode,
        categoryId: room.settings.categoryId,
        difficulty: room.settings.difficulty,
        numRounds: room.settings.numRounds,
        currentRound: room.settings.currentRound,
        numImpostors: room.settings.numImpostors,
        clueTimer: room.settings.clueTimer,
        discussionTimer: room.settings.discussionTimer,
        votingTimer: room.settings.votingTimer,
        maxPlayers: room.settings.maxPlayers,
      }).onConflictDoNothing().then(() => {
        return db.insert(roomPlayers).values({
          roomId: room.id,
          userId: hostPlayer.userId,
          name: hostPlayer.name,
          avatar: hostPlayer.avatar,
          isHost: true,
          isReady: true,
          isConnected: true,
          score: 0,
        }).onConflictDoNothing();
      }).catch((err: Error) => {
        console.error("DB Room Insert error:", err);
      });
    }

    return room;
  }

  public static joinRoom(
    code: string,
    userId: string,
    name: string,
    avatar: string
  ): { room: RoomState | null; error?: string } {
    const uppercaseCode = code.toUpperCase();
    const room = roomsMap.get(uppercaseCode);

    if (!room) {
      return { room: null, error: "Room not found" };
    }

    // Check if player already in room (reconnect)
    const existingIndex = room.players.findIndex((p) => p.userId === userId);
    if (existingIndex !== -1) {
      room.players[existingIndex].isConnected = true;
      room.players[existingIndex].name = name;
      room.players[existingIndex].avatar = avatar;
      room.players[existingIndex].lastSeenAt = Date.now();
      room.updatedAt = Date.now();
      return { room };
    }

    if (room.status !== "lobby") {
      return { room: null, error: "Game already in progress" };
    }

    if (room.players.length >= room.settings.maxPlayers) {
      return { room: null, error: "Room is full" };
    }

    const newPlayer: PlayerState = {
      userId,
      name,
      avatar,
      isHost: false,
      isReady: false,
      isConnected: true,
      isBot: false,
      score: 0,
      lastSeenAt: Date.now(),
    };

    room.players.push(newPlayer);
    room.updatedAt = Date.now();

    // Async DB update (Optional)
    if (db) {
      db.insert(roomPlayers).values({
        roomId: room.id,
        userId: newPlayer.userId,
        name: newPlayer.name,
        avatar: newPlayer.avatar,
        isHost: false,
        isReady: false,
        isConnected: true,
        score: 0,
      }).catch((err: Error) => console.error("Error inserting room player:", err));
    }

    return { room };
  }

  public static toggleReady(code: string, userId: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room) return null;

    const player = room.players.find((p) => p.userId === userId);
    if (player) {
      player.isReady = !player.isReady;
      room.updatedAt = Date.now();
    }
    return room;
  }

  public static updateSettings(
    code: string,
    hostUserId: string,
    settings: Partial<RoomState["settings"]>
  ): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || room.hostUserId !== hostUserId || room.status !== "lobby") return null;

    room.settings = {
      ...room.settings,
      ...settings,
    };
    room.updatedAt = Date.now();
    return room;
  }

  public static kickPlayer(code: string, hostUserId: string, targetUserId: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || room.hostUserId !== hostUserId || hostUserId === targetUserId) return null;

    room.players = room.players.filter((p) => p.userId !== targetUserId);
    room.updatedAt = Date.now();
    return room;
  }

  public static transferHost(code: string, currentHostId: string, newHostId: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || room.hostUserId !== currentHostId) return null;

    const newHost = room.players.find((p) => p.userId === newHostId);
    if (!newHost) return null;

    room.hostUserId = newHostId;
    room.players.forEach((p) => {
      p.isHost = p.userId === newHostId;
    });
    room.updatedAt = Date.now();
    return room;
  }

  public static leaveRoom(code: string, userId: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room) return null;

    room.players = room.players.filter((p) => p.userId !== userId);

    if (room.players.length === 0) {
      roomsMap.delete(code.toUpperCase());
      return null;
    }

    // If host left, assign new host
    if (room.hostUserId === userId) {
      room.hostUserId = room.players[0].userId;
      room.players[0].isHost = true;
      room.players[0].isReady = true;
    }

    room.updatedAt = Date.now();
    return room;
  }

  public static async startGame(code: string, hostUserId: string): Promise<{ room: RoomState | null; error?: string }> {
    const room = roomsMap.get(code.toUpperCase());
    if (!room) return { room: null, error: "Room not found" };
    if (room.hostUserId !== hostUserId) return { room: null, error: "Only host can start game" };
    if (room.players.length < 3) return { room: null, error: "At least 3 players required to start" };

    room.status = "in_game";
    room.settings.currentRound = 1;

    // Reset scores
    room.players.forEach((p) => {
      p.score = 0;
    });

    const gameId = getUUID();

    // Select Word & Assign Roles for Round 1
    await this.startRound(room, gameId, 1);

    room.updatedAt = Date.now();

    // Save to DB (Optional)
    if (db) {
      try {
        await db.update(rooms).set({ status: "in_game", updatedAt: new Date() }).where(eq(rooms.id, room.id));
      } catch (e) {
        console.error("DB Start Game Error:", e);
      }
    }

    return { room };
  }

  private static getRandomWord(categoryId: string, difficulty: string, excludeList: string[] = []): WordData {
    let filtered = INITIAL_WORDS.filter(
      (w) => w.category === categoryId && !excludeList.includes(w.word)
    );

    // If all words in category used, ignore difficulty and used status as last resort
    if (filtered.length === 0) {
      filtered = INITIAL_WORDS.filter((w) => w.category === categoryId);
    }

    if (filtered.length === 0) {
      filtered = INITIAL_WORDS;
    }

    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  private static async startRound(room: RoomState, gameId: string, roundNum: number) {
    let categoryId = room.settings.categoryId;

    // Ensure usedWords is initialized (for older sessions in memory)
    if (!room.usedWords) {
      room.usedWords = [];
    }

    // AI only chooses the CATEGORY if user selected "random"
    if (categoryId === "random") {
      categoryId = AiManager.suggestCategory();
    }

    // Attempt AI Generation for the WORD (if AI mode is ON)
    let wordData: WordData | null = null;
    if (room.settings.isAiMode) {
      console.log(`[Game] Attempting AI generation for ${categoryId}...`);
      wordData = await AiManager.generateDynamicWord(categoryId, room.settings.difficulty, room.usedWords);
    }

    // Fallback to static list if AI fails or is OFF
    if (!wordData) {
      console.log(`[Game] Using static fallback for ${categoryId}`);
      wordData = this.getRandomWord(categoryId, room.settings.difficulty, room.usedWords);
    }

    // Record word to prevent future repetition
    if (wordData && wordData.word) {
      room.usedWords.push(wordData.word);
    }

    // AI Mission Briefing (Async)
    const briefing = room.settings.isAiMode
      ? await AiManager.generateMissionBriefing(categoryId, wordData.word)
      : undefined;

    const roundId = getUUID();

    // Assign Roles
    const roles: Record<string, "civilian" | "impostor" | "liar"> = {};
    const playerIds = room.players.map((p) => p.userId);

    if (room.settings.gameMode === "find_liar") {
      const liarIds = AiManager.selectStrategicImpostor(playerIds, room.pastImpostors, 1);
      const liarId = liarIds[0];
      playerIds.forEach((id) => {
        roles[id] = id === liarId ? "liar" : "civilian";
      });
      room.pastImpostors.push(liarId);
    } else {
      // Classic or Multi Impostor
      let countImpostors = room.settings.numImpostors;
      if (room.settings.gameMode === "classic") {
        countImpostors = 1;
      } else {
        countImpostors = Math.min(countImpostors, Math.max(1, room.players.length - 2));
      }

      const impostorIds = new Set(AiManager.selectStrategicImpostor(playerIds, room.pastImpostors, countImpostors));
      playerIds.forEach((id) => {
        roles[id] = impostorIds.has(id) ? "impostor" : "civilian";
      });
      impostorIds.forEach(id => room.pastImpostors.push(id));
    }

    // Reset past impostors if everyone has been one to cycle again
    if (room.pastImpostors.length >= playerIds.length) {
      room.pastImpostors = [];
    }

    // First player turn index
    const turnIndex = 0;
    const firstTurnUserId = room.players[0].userId;

    room.activeGame = {
      gameId,
      roundId,
      roundNumber: roundNum,
      totalRounds: room.settings.numRounds,
      secretWord: wordData.word,
      secretWordTa: wordData.wordTa,
      secretWordHi: wordData.wordHi,
      liarQuestionNormal: wordData.liarNormal,
      liarQuestionNormalTa: wordData.liarNormalTa,
      liarQuestionNormalHi: wordData.liarNormalHi,
      liarQuestionLiar: wordData.liarLiar,
      liarQuestionLiarTa: wordData.liarLiarTa,
      liarQuestionLiarHi: wordData.liarLiarHi,
      status: "role_reveal",
      playerRoles: roles,
      clues: [],
      currentTurnUserId: firstTurnUserId,
      turnIndex: 0,
      timerExpiresAt: Date.now() + 6000, // 6s role reveal screen
      votes: {},
      revealedVotes: null,
      suspectedUserId: null,
      isTie: false,
      impostorGuess: null,
      impostorGuessCorrect: null,
      roundWinnerTeam: null,
      roundPoints: {},
      roundSummaryMessage: null,
      aiBriefing: briefing,
      secureCommStream: [],
    };
  }

  // Handle automatic timer check & state progress
  public static checkAndAdvanceState(code: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || !room.activeGame || !room.activeGame.timerExpiresAt) return room || null;

    const now = Date.now();
    if (now >= room.activeGame.timerExpiresAt) {
      const ag = room.activeGame;

      if (ag.status === "role_reveal") {
        // Transition to Clue Turn
        ag.status = "clue_turn";
        ag.turnIndex = 0;
        ag.currentTurnUserId = room.players[0].userId;
        ag.timerExpiresAt = now + room.settings.clueTimer * 1000;
        room.updatedAt = now;
      } else if (ag.status === "clue_turn") {
        // AI BOT TURN CHECK
        if (ag.currentTurnUserId?.startsWith("bot_")) {
          const botPlayer = room.players.find(p => p.userId === ag.currentTurnUserId);
          if (botPlayer) {
            console.log(`[Bot] ${botPlayer.name} generating clue...`);
            AiManager.generateBotClue(
              ag.playerRoles[botPlayer.userId],
              ag.secretWord,
              ag.clues.map(c => c.text)
            ).then(clue => {
              this.submitClue(room.code, botPlayer.userId, clue || "Transmission");
            });
          }
        }

        // Timeout for current player clue -> insert auto skip clue & move to next turn or discussion
        if (ag.currentTurnUserId) {
          const activeP = room.players.find((p) => p.userId === ag.currentTurnUserId);
          ag.clues.push({
            userId: ag.currentTurnUserId,
            name: activeP?.name || "Player",
            avatar: activeP?.avatar || "User",
            turnIndex: ag.turnIndex,
            text: "(Passed / Timeout)",
            timestamp: now,
          });
        }

        ag.turnIndex += 1;
        if (ag.turnIndex < room.players.length) {
          ag.currentTurnUserId = room.players[ag.turnIndex].userId;
          ag.timerExpiresAt = now + room.settings.clueTimer * 1000;
        } else {
          // All players gave clues -> Discussion Phase
          ag.status = "discussion";
          ag.currentTurnUserId = null;
          ag.timerExpiresAt = now + room.settings.discussionTimer * 1000;

          // Start AI Anomaly Detection (Async)
          if (room.settings.isAiMode) {
            AiManager.analyzeAnomaly(ag.clues, ag.secretWord).then(name => {
              ag.aiAnomalyName = name;
              room.updatedAt = Date.now();
            });
          }
        }
        room.updatedAt = now;
      } else if (ag.status === "discussion") {
        // Transition to Voting Phase
        ag.status = "voting";
        ag.timerExpiresAt = now + room.settings.votingTimer * 1000;

        // AI BOT VOTE (Pre-calculate for end of voting)
        room.players.forEach(p => {
          if (p.isBot) {
            const potentialTargets = room.players.filter(tp => tp.userId !== p.userId).map(tp => tp.userId);
            ag.votes[p.userId] = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
          }
        });

        room.updatedAt = now;
      } else if (ag.status === "voting") {
        // Voting timeout -> evaluate votes
        this.evaluateVotingResults(room);
      } else if (ag.status === "vote_result") {
        // Vote result display timeout -> move to next phase
        if (room.settings.gameMode === "find_liar") {
          this.evaluateRoundResults(room, false, null);
        } else {
          ag.status = "impostor_guess";
          ag.timerExpiresAt = now + 25000; // 25s for impostor guess
        }
        room.updatedAt = now;
      } else if (ag.status === "impostor_guess") {
        // Impostor guess timeout -> evaluate round results
        this.evaluateRoundResults(room, false, null);
      }
    }

    return room;
  }

  public static submitClue(code: string, userId: string, clueText: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || !room.activeGame || room.activeGame.status !== "clue_turn") return null;

    const ag = room.activeGame;
    if (ag.currentTurnUserId !== userId) return null; // Not this player's turn

    const player = room.players.find((p) => p.userId === userId);
    if (!player) return null;

    ag.clues.push({
      userId,
      name: player.name,
      avatar: player.avatar,
      turnIndex: ag.turnIndex,
      text: clueText.trim().slice(0, 40),
      timestamp: Date.now(),
    });

    ag.turnIndex += 1;
    const now = Date.now();

    if (ag.turnIndex < room.players.length) {
      ag.currentTurnUserId = room.players[ag.turnIndex].userId;
      ag.timerExpiresAt = now + room.settings.clueTimer * 1000;
    } else {
      // All clues submitted -> Discussion
      ag.status = "discussion";
      ag.currentTurnUserId = null;
      ag.timerExpiresAt = now + room.settings.discussionTimer * 1000;
    }

    room.updatedAt = now;
    return room;
  }

  public static submitVote(code: string, voterUserId: string, suspectUserId: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || !room.activeGame || room.activeGame.status !== "voting") return null;

    if (voterUserId === suspectUserId) return null; // Cannot vote for self

    const ag = room.activeGame;
    ag.votes[voterUserId] = suspectUserId;
    room.updatedAt = Date.now();

    // If all active players voted, immediately evaluate votes!
    if (Object.keys(ag.votes).length >= room.players.length) {
      this.evaluateVotingResults(room);
    }

    return room;
  }

  public static addBot(code: string, hostUserId: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || room.hostUserId !== hostUserId || room.players.length >= room.settings.maxPlayers) return null;

    const botId = "bot_" + getUUID();
    const names = ["Alpha", "Beta", "Gamma", "Delta", "Omega", "Zeta", "Sigma"];
    const avatars = ["User", "Shield", "Zap", "Target", "Ghost", "Sword"];

    const bot: PlayerState = {
      userId: botId,
      name: `AI_${names[Math.floor(Math.random() * names.length)]}`,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      isHost: false,
      isReady: true,
      isConnected: true,
      isBot: true,
      score: 0,
      lastSeenAt: Date.now()
    };

    room.players.push(bot);
    room.updatedAt = Date.now();
    return room;
  }

  public static submitSecureSignal(code: string, userId: string, text: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || !room.activeGame || room.activeGame.status !== "discussion") return null;

    const player = room.players.find(p => p.userId === userId);
    if (!player || room.activeGame.playerRoles[userId] === "impostor") return null;

    room.activeGame.secureCommStream.push({
      name: player.name,
      text: text.trim().slice(0, 100)
    });

    room.updatedAt = Date.now();
    return room;
  }

  private static evaluateVotingResults(room: RoomState) {
    const ag = room.activeGame;
    if (!ag) return;

    const voteCounts: Record<string, number> = {};
    const revealedVotes: VoteEntry[] = [];

    // Tally votes
    room.players.forEach((p) => {
      voteCounts[p.userId] = 0;
    });

    Object.entries(ag.votes).forEach(([voterId, suspectId]) => {
      const voterP = room.players.find((p) => p.userId === voterId);
      const suspectP = room.players.find((p) => p.userId === suspectId);
      if (voterP && suspectP) {
        revealedVotes.push({
          voterUserId: voterId,
          voterName: voterP.name,
          suspectUserId: suspectId,
          suspectName: suspectP.name,
        });
        voteCounts[suspectId] = (voteCounts[suspectId] || 0) + 1;
      }
    });

    ag.revealedVotes = revealedVotes;

    // Find highest voted player
    let maxVotes = -1;
    let topSuspectId: string | null = null;
    let isTie = false;

    Object.entries(voteCounts).forEach(([suspectId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topSuspectId = suspectId;
        isTie = false;
      } else if (count === maxVotes && maxVotes > 0) {
        isTie = true;
      }
    });

    ag.suspectedUserId = isTie ? null : topSuspectId;
    ag.isTie = isTie;
    ag.status = "vote_result";
    ag.timerExpiresAt = Date.now() + 7000; // 7s vote reveal transition

    // Check if suspected player is impostor/liar
    const suspectedRole = ag.suspectedUserId ? ag.playerRoles[ag.suspectedUserId] : null;

    if (room.settings.gameMode === "find_liar") {
      if (suspectedRole === "liar") {
        ag.roundWinnerTeam = "civilians";
      } else {
        ag.roundWinnerTeam = "impostors";
      }
    } else {
      // Classic or Multi Impostor mode
      // If an Impostor survived or was identified, afford the Impostor Guess Phase
      if (ag.suspectedUserId && (suspectedRole === "impostor")) {
        // Civilians correctly identified impostor! Give impostor 1 chance to guess secret word
        ag.roundWinnerTeam = "civilians";
      } else {
        // Impostors survived or wrong civilian voted
        ag.roundWinnerTeam = "impostors";
      }
    }

    room.updatedAt = Date.now();
  }

  public static submitImpostorGuess(code: string, userId: string, guess: string): RoomState | null {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || !room.activeGame || room.activeGame.status !== "impostor_guess") return null;

    const ag = room.activeGame;
    if (ag.playerRoles[userId] !== "impostor") return null; // Only impostor can guess

    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedSecret = ag.secretWord.toLowerCase();

    // Check match or close match
    const isCorrect = normalizedGuess === normalizedSecret || (normalizedGuess.length >= 3 && normalizedSecret.includes(normalizedGuess));

    this.evaluateRoundResults(room, true, isCorrect, guess);
    return room;
  }

  private static evaluateRoundResults(
    room: RoomState,
    guessed: boolean,
    isCorrect: boolean | null,
    guessText?: string
  ) {
    const ag = room.activeGame;
    if (!ag) return;

    ag.status = "round_result";
    ag.timerExpiresAt = null;

    if (guessed) {
      ag.impostorGuess = guessText || "";
      ag.impostorGuessCorrect = isCorrect;
    }

    // Point Calculation
    const roundPts: Record<string, number> = {};
    room.players.forEach((p) => {
      roundPts[p.userId] = 0;
    });

    const isImpostorVictory = ag.roundWinnerTeam === "impostors";

    room.players.forEach((p) => {
      const role = ag.playerRoles[p.userId];
      if (role === "civilian") {
        if (!isImpostorVictory) {
          // Civilian win
          roundPts[p.userId] += 100;
        }
        // Check if civilian voted correctly for impostor
        const userVote = ag.votes[p.userId];
        if (userVote && (ag.playerRoles[userVote] === "impostor" || ag.playerRoles[userVote] === "liar")) {
          roundPts[p.userId] += 50; // Detective bonus
        }
      } else if (role === "impostor" || role === "liar") {
        if (isImpostorVictory) {
          // Impostor survived
          roundPts[p.userId] += 150;
        }
        if (isCorrect) {
          // Correct guess bonus
          roundPts[p.userId] += 100;
        }
      }

      // Add points to cumulative score
      p.score += roundPts[p.userId];
    });

    ag.roundPoints = roundPts;

    // AI Round Recap (Async)
    if (room.settings.isAiMode) {
      AiManager.generateRoundRecap(!isImpostorVictory, ag.secretWord).then(recap => {
        ag.aiRoundRecap = recap;
        room.updatedAt = Date.now();
      });
    }

    // Summary Message
    if (ag.roundWinnerTeam === "civilians") {
      ag.roundSummaryMessage = isCorrect
        ? "Civilians voted out the Impostor, but the Impostor guessed the Secret Word!"
        : "Civilians successfully spotted the Impostor!";
    } else {
      ag.roundSummaryMessage = "The Impostor bluffed successfully and evaded detection!";
    }

    room.updatedAt = Date.now();
  }

  public static async nextRoundOrFinish(code: string, hostUserId: string): Promise<RoomState | null> {
    const room = roomsMap.get(code.toUpperCase());
    if (!room || room.hostUserId !== hostUserId || !room.activeGame) return null;

    if (room.settings.currentRound < room.settings.numRounds) {
      // Next Round
      room.settings.currentRound += 1;
      const gameId = room.activeGame.gameId;
      await this.startRound(room, gameId, room.settings.currentRound);
    } else {
      // Final Game Over
      room.activeGame.status = "game_over";
      room.status = "ended";

      // Calculate winners
      let highestScore = -1;
      let winners: string[] = [];

      room.players.forEach((p) => {
        if (p.score > highestScore) {
          highestScore = p.score;
          winners = [p.userId];
        } else if (p.score === highestScore) {
          winners.push(p.userId);
        }
      });

      room.activeGame.overallWinnerUserIds = winners;

      // Update User DB stats (Optional)
      if (db) {
        try {
          for (const p of room.players) {
            const isWinner = winners.includes(p.userId);
            await db
              .update(users)
              .set({
                totalGames: sql`${users.totalGames} + 1`,
                totalWins: isWinner ? sql`${users.totalWins} + 1` : users.totalWins,
                totalPoints: sql`${users.totalPoints} + ${p.score}`,
                updatedAt: new Date(),
              })
              .where(eq(users.id, p.userId));
          }
        } catch (e) {
          console.error("DB Stats update error:", e);
        }
      }
    }

    room.updatedAt = Date.now();
    return room;
  }

  // Sanitize room state for specific client view (authoritative protection against cheats!)
  public static getSanitizedClientState(room: RoomState, clientUserId: string): RoomState {
    // Clone room
    const clientRoom: RoomState = JSON.parse(JSON.stringify(room));

    if (!clientRoom.activeGame) {
      return clientRoom;
    }

    const ag = clientRoom.activeGame;
    const clientRole = ag.playerRoles[clientUserId] || "civilian";

    const isHiddenPhase =
      ag.status === "role_reveal" ||
      ag.status === "clue_turn" ||
      ag.status === "discussion" ||
      ag.status === "voting";

    if (isHiddenPhase) {
      if (clientRole === "impostor") {
        // Impostor DOES NOT see secret word!
        ag.secretWord = "???";
        ag.secretWordTa = "???";
        ag.secretWordHi = "???";
      } else if (clientRole === "liar") {
        ag.secretWord = ag.liarQuestionLiar || "???";
        ag.secretWordTa = ag.liarQuestionLiarTa || ag.secretWord;
        ag.secretWordHi = ag.liarQuestionLiarHi || ag.secretWord;
      } else {
        if (room.settings.gameMode === "find_liar") {
          ag.secretWord = ag.liarQuestionNormal || "???";
          ag.secretWordTa = ag.liarQuestionNormalTa || ag.secretWord;
          ag.secretWordHi = ag.liarQuestionNormalHi || ag.secretWord;
        }
      }

      // Hide all player roles during active gameplay!
      const maskedRoles: Record<string, "civilian" | "impostor" | "liar"> = {};
      Object.keys(ag.playerRoles).forEach((uid) => {
        if (uid === clientUserId) {
          maskedRoles[uid] = ag.playerRoles[uid];
        } else if (
          room.settings.gameMode === "multi_impostor" &&
          clientRole === "impostor" &&
          ag.playerRoles[uid] === "impostor"
        ) {
          // Teammate impostors can see each other in multi impostor mode!
          maskedRoles[uid] = "impostor";
        } else {
          // Hide others
          maskedRoles[uid] = "civilian";
        }
      });

      ag.playerRoles = maskedRoles;

      // Scramble Secure Comm-Link for Impostor
      if (clientRole === "impostor") {
        ag.secureCommStream = ag.secureCommStream.map(s => ({
          name: s.name,
          text: "[DATA_ENCRYPTED_BY_AI_UPLINK]"
        }));
      }

      // Hide active votes in voting phase
      if (ag.status === "voting") {
        const maskedVotes: Record<string, string> = {};
        Object.keys(ag.votes).forEach((voterId) => {
          if (voterId === clientUserId) {
            maskedVotes[voterId] = ag.votes[voterId];
          } else {
            maskedVotes[voterId] = "hidden_voted";
          }
        });
        ag.votes = maskedVotes;
      }
    }

    return clientRoom;
  }
}
