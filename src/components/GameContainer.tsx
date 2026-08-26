"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { CreateRoomModal } from "@/components/CreateRoomModal";
import { JoinRoomModal } from "@/components/JoinRoomModal";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { ProfileModal } from "@/components/ProfileModal";
import { RoomSettingsModal } from "@/components/RoomSettingsModal";
import { LobbyScreen } from "@/components/LobbyScreen";
import { RoleRevealScreen } from "@/components/RoleRevealScreen";
import { ClueTurnScreen } from "@/components/ClueTurnScreen";
import { DiscussionScreen } from "@/components/DiscussionScreen";
import { VotingScreen } from "@/components/VotingScreen";
import { VoteResultsScreen } from "@/components/VoteResultsScreen";
import { ImpostorGuessScreen } from "@/components/ImpostorGuessScreen";
import { RoundResultsScreen } from "@/components/RoundResultsScreen";
import { FinalResultsScreen } from "@/components/FinalResultsScreen";

import { RoomState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { API_BASE } from "@/lib/apiConfig";
import * as Icons from "lucide-react";

interface UserProfile {
  id: string;
  guestId: string;
  username: string;
  avatar: string;
  totalGames: number;
  totalWins: number;
  totalPoints: number;
}

export default function GameContainer() {
  const [lang, setLang] = useState<Language>("en");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRoomSettings, setShowRoomSettings] = useState(false);

  // Load / Init Guest Auth
  useEffect(() => {
    let savedGuestId = localStorage.getItem("bluffix_guest_id");
    let savedName = localStorage.getItem("bluffix_username");
    let savedAvatar = localStorage.getItem("bluffix_avatar");

    fetch(`${API_BASE}/api/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestId: savedGuestId,
        username: savedName,
        avatar: savedAvatar,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("bluffix_guest_id", data.user.guestId);
          localStorage.setItem("bluffix_username", data.user.username);
          localStorage.setItem("bluffix_avatar", data.user.avatar);

          // Auto-join if link parameter exists
          const params = new URLSearchParams(window.location.search);
          const joinCode = params.get("join");
          if (joinCode && !room) {
            handleJoinRoom(joinCode.toUpperCase());
            // Clear URL param
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Poll / Stream state for active room
  const fetchRoomState = useCallback(async (code: string, userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/rooms/${code}?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!room || !user) return;

    // Fast Polling interval
    const interval = setInterval(() => {
      fetchRoomState(room.code, user.id);
    }, 1500);

    // Event Source (SSE Stream)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_BASE}/api/rooms/${room.code}/events?userId=${user.id}`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "ROOM_UPDATE" && data.room) {
            setRoom(data.room);
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore fallback to interval
    }

    return () => {
      clearInterval(interval);
      if (eventSource) eventSource.close();
    };
  }, [room?.code, user?.id, fetchRoomState]);

  // Actions
  const handleCreateRoom = async (settings: any) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          settings,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
        setShowCreateModal(false);
      } else {
        alert(data.error || "Initialization failed at network layer");
      }
    } catch (e) {
      console.error(e);
      alert("Terminal failure: System unavailable");
    }
  };

  const handleJoinRoom = async (code: string) => {
    if (!user) return;
    setJoinError(null);
    try {
      const res = await fetch(`${API_BASE}/api/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
        setShowJoinModal(false);
      } else {
        setJoinError(data.error || "Could not join room");
      }
    } catch (e) {
      console.error(e);
      setJoinError("Failed to connect to server");
    }
  };

  const handleReady = async () => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/ready`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartGame = async () => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSettings = async (settings: any) => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, hostUserId: user.id, settings }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleKick = async (targetUserId: string) => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/kick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, hostUserId: user.id, targetUserId }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTransferHost = async (newHostId: string) => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/transfer-host`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, currentHostId: user.id, newHostId }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveRoom = async () => {
    if (!room || !user) return;
    try {
      await fetch(`${API_BASE}/api/rooms/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id }),
      });
      setRoom(null);
    } catch (e) {
      console.error(e);
      setRoom(null);
    }
  };

  const handleAddBot = async () => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/add-bot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitClue = async (clue: string) => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/clue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id, clue }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitVote = async (suspectUserId: string) => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id, suspectUserId }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitImpostorGuess = async (guess: string) => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/impostor-guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id, guess }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextRound = async () => {
    if (!room || !user) return;
    try {
      const res = await fetch(`${API_BASE}/api/rooms/next-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: room.code, userId: user.id }),
      });
      const data = await res.json();
      if (data.success && data.room) setRoom(data.room);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = (username: string, avatar: string) => {
    if (!user) return;
    setUser({ ...user, username, avatar });
    localStorage.setItem("bluffix_username", username);
    localStorage.setItem("bluffix_avatar", avatar);
    fetch(`${API_BASE}/api/auth/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId: user.guestId, username, avatar }),
    }).catch(() => {});
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenProfile={() => setShowProfile(true)}
        user={user}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center relative">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>

        {!room ? (
          /* HOME SCREEN REDESIGN */
          <div className="max-w-xl mx-auto w-full space-y-12 text-center animate-in fade-in zoom-in-95 duration-700 py-10">
            {/* Hero Logo Banner */}
            <div className="space-y-6">
              <div className="relative inline-flex items-center justify-center group">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative w-28 h-28 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                  <Icons.Sparkles className="w-12 h-12 text-indigo-400 animate-float" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white uppercase italic">
                  {t.gameTitle}<span className="text-rose-500 not-italic">.</span>
                </h1>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] px-4">
                  Neural Intelligence Deducted
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 gap-4 pt-4 max-w-sm mx-auto">
              {!user && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  System Offline: Establishing Secure Link...
                </div>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  if (!user) return;
                  setShowCreateModal(true);
                }}
                disabled={!user}
                className="group relative w-full py-5 bg-white text-black disabled:opacity-20 font-black text-sm rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <Icons.Users className="w-5 h-5" />
                <span className="uppercase tracking-widest">{t.createRoom}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setShowJoinModal(true);
                }}
                className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-black text-sm rounded-2xl border border-zinc-800 shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
              >
                <Icons.KeyRound className="w-5 h-5 text-indigo-400" />
                <span className="uppercase tracking-widest">{t.joinRoom}</span>
              </button>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowHowToPlay(true);
                  }}
                  className="py-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-2"
                >
                  <Icons.HelpCircle className="w-4 h-4" />
                  <span>Rules</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowLeaderboard(true);
                  }}
                  className="py-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center space-x-2"
                >
                  <Icons.Trophy className="w-4 h-4" />
                  <span>Ranks</span>
                </button>
              </div>
            </div>

            <div className="pt-8 text-[10px] font-black text-zinc-600 uppercase tracking-widest animate-pulse">
              Built for bluffers & word detectives
            </div>
          </div>
        ) : (
          /* ACTIVE ROOM SCREEN ROUTER */
          <div>
            {room.status === "lobby" && user && (
              <LobbyScreen
                room={room}
                currentUserId={user.id}
                lang={lang}
                onReady={handleReady}
                onStart={handleStartGame}
                onKick={handleKick}
                onTransferHost={handleTransferHost}
                onLeave={handleLeaveRoom}
                onOpenSettings={() => setShowRoomSettings(true)}
                onAddBot={handleAddBot}
              />
            )}

            {room.status === "in_game" && room.activeGame && user && (
              <div>
                {room.activeGame.status === "role_reveal" && (
                  <RoleRevealScreen
                    activeGame={room.activeGame}
                    currentUserId={user.id}
                    lang={lang}
                  />
                )}

                {room.activeGame.status === "clue_turn" && (
                  <ClueTurnScreen
                    activeGame={room.activeGame}
                    players={room.players}
                    currentUserId={user.id}
                    lang={lang}
                    onSubmitClue={handleSubmitClue}
                  />
                )}

                {room.activeGame.status === "discussion" && (
                  <DiscussionScreen
                    activeGame={room.activeGame}
                    players={room.players}
                    currentUserId={user.id}
                    lang={lang}
                    roomCode={room.code}
                  />
                )}

                {room.activeGame.status === "voting" && (
                  <VotingScreen
                    activeGame={room.activeGame}
                    players={room.players}
                    currentUserId={user.id}
                    lang={lang}
                    onVote={handleSubmitVote}
                  />
                )}

                {room.activeGame.status === "vote_result" && (
                  <VoteResultsScreen
                    activeGame={room.activeGame}
                    players={room.players}
                    currentUserId={user.id}
                    lang={lang}
                  />
                )}

                {room.activeGame.status === "impostor_guess" && (
                  <ImpostorGuessScreen
                    activeGame={room.activeGame}
                    players={room.players}
                    currentUserId={user.id}
                    lang={lang}
                    onSubmitGuess={handleSubmitImpostorGuess}
                  />
                )}

                {room.activeGame.status === "round_result" && (
                  <RoundResultsScreen
                    room={room}
                    activeGame={room.activeGame}
                    currentUserId={user.id}
                    lang={lang}
                    onNextRound={handleNextRound}
                  />
                )}

                {room.activeGame.status === "game_over" && (
                  <FinalResultsScreen
                    room={room}
                    currentUserId={user.id}
                    lang={lang}
                    onPlayAgain={handleStartGame}
                    onLeave={handleLeaveRoom}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      {showCreateModal && (
        <CreateRoomModal
          lang={lang}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {showJoinModal && (
        <JoinRoomModal
          lang={lang}
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinRoom}
          error={joinError}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal lang={lang} onClose={() => setShowHowToPlay(false)} />
      )}

      {showLeaderboard && (
        <LeaderboardModal lang={lang} onClose={() => setShowLeaderboard(false)} />
      )}

      {showProfile && user && (
        <ProfileModal
          lang={lang}
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={handleUpdateProfile}
        />
      )}

      {showRoomSettings && room && (
        <RoomSettingsModal
          lang={lang}
          currentSettings={room.settings}
          onClose={() => setShowRoomSettings(false)}
          onSave={handleUpdateSettings}
        />
      )}
    </div>
  );
}
