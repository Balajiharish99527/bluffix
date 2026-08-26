import { pgTable, text, integer, timestamp, boolean, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  guestId: varchar("guest_id", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 32 }).notNull(),
  avatar: text("avatar").notNull().default("User"),
  totalGames: integer("total_games").notNull().default(0),
  totalWins: integer("total_wins").notNull().default(0),
  impostorWins: integer("impostor_wins").notNull().default(0),
  civilianWins: integer("civilian_wins").notNull().default(0),
  totalPoints: integer("total_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  nameTa: varchar("name_ta", { length: 64 }).notNull(),
  nameHi: varchar("name_hi", { length: 64 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 32 }).notNull().default("🎯"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const words = pgTable("words", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: varchar("category_id", { length: 64 }).notNull().references(() => categories.id, { onDelete: "cascade" }),
  word: varchar("word", { length: 128 }).notNull(),
  wordTa: varchar("word_ta", { length: 128 }).notNull(),
  wordHi: varchar("word_hi", { length: 128 }).notNull(),
  difficulty: varchar("difficulty", { length: 16 }).notNull().default("medium"), // easy, medium, hard
  liarQuestionNormal: text("liar_question_normal"),
  liarQuestionLiar: text("liar_question_liar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 6 }).notNull().unique(),
  hostUserId: uuid("host_user_id").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("lobby"), // lobby, in_game, ended
  gameMode: varchar("game_mode", { length: 32 }).notNull().default("classic"), // classic, multi_impostor, find_liar
  categoryId: varchar("category_id", { length: 64 }).notNull().default("food"),
  difficulty: varchar("difficulty", { length: 16 }).notNull().default("medium"),
  numRounds: integer("num_rounds").notNull().default(3),
  currentRound: integer("current_round").notNull().default(1),
  numImpostors: integer("num_impostors").notNull().default(1),
  clueTimer: integer("clue_timer").notNull().default(45), // seconds
  discussionTimer: integer("discussion_timer").notNull().default(60), // seconds
  votingTimer: integer("voting_timer").notNull().default(30), // seconds
  maxPlayers: integer("max_players").notNull().default(8),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roomPlayers = pgTable("room_players", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 32 }).notNull(),
  avatar: text("avatar").notNull().default("🦊"),
  isHost: boolean("is_host").notNull().default(false),
  isReady: boolean("is_ready").notNull().default(false),
  isConnected: boolean("is_connected").notNull().default(true),
  score: integer("score").notNull().default(0),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  gameMode: varchar("game_mode", { length: 32 }).notNull(),
  categoryId: varchar("category_id", { length: 64 }).notNull(),
  totalRounds: integer("total_rounds").notNull(),
  winnerTeam: varchar("winner_team", { length: 32 }), // civilians, impostors, tie
  createdAt: timestamp("created_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const rounds = pgTable("rounds", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  roundNumber: integer("round_number").notNull(),
  secretWord: varchar("secret_word", { length: 128 }).notNull(),
  secretWordTa: varchar("secret_word_ta", { length: 128 }),
  secretWordHi: varchar("secret_word_hi", { length: 128 }),
  liarQuestionNormal: text("liar_question_normal"),
  liarQuestionLiar: text("liar_question_liar"),
  status: varchar("status", { length: 32 }).notNull().default("role_reveal"), // role_reveal, clue_turn, discussion, voting, vote_result, impostor_guess, round_result
  currentTurnIndex: integer("current_turn_index").notNull().default(0),
  winningTeam: varchar("winning_team", { length: 32 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roundPlayers = pgTable("round_players", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id").notNull().references(() => rounds.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 32 }).notNull().default("civilian"), // civilian, impostor, liar
  isEliminated: boolean("is_eliminated").notNull().default(false),
  pointsEarned: integer("points_earned").notNull().default(0),
});

export const clues = pgTable("clues", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id").notNull().references(() => rounds.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  turnIndex: integer("turn_index").notNull(),
  clueText: text("clue_text").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  roundId: uuid("round_id").notNull().references(() => rounds.id, { onDelete: "cascade" }),
  voterUserId: uuid("voter_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  suspectUserId: uuid("suspect_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const scores = pgTable("scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  roundId: uuid("round_id").references(() => rounds.id, { onDelete: "set null" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pointsAdded: integer("points_added").notNull(),
  reason: varchar("reason", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameHistory = pgTable("game_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 32 }).notNull(),
  won: boolean("won").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
