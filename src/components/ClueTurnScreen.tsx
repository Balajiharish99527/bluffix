"use client";

import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { ActiveGame, PlayerState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";

interface ClueTurnScreenProps {
  activeGame: ActiveGame;
  players: PlayerState[];
  currentUserId: string;
  lang: Language;
  onSubmitClue: (clue: string) => void;
}

export const ClueTurnScreen: React.FC<ClueTurnScreenProps> = ({
  activeGame,
  players,
  currentUserId,
  lang,
  onSubmitClue,
}) => {
  const t = translations[lang];
  const [clueText, setClueText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  const isMyTurn = activeGame.currentTurnUserId === currentUserId;
  const currentTurnPlayer = players.find((p) => p.userId === activeGame.currentTurnUserId);
  const myRole = activeGame.playerRoles[currentUserId];

  useEffect(() => {
    if (!activeGame.timerExpiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((activeGame.timerExpiresAt! - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0) {
        sounds.playTick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGame.timerExpiresAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueText.trim() || !isMyTurn) return;
    sounds.playClick();
    onSubmitClue(clueText.trim());
    setClueText("");
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-500">
      {/* HUD Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-center">
          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Identity / Word
          </div>
          <div className="text-sm font-black text-white mt-1 uppercase italic tracking-tighter">
            {myRole === "impostor" ? (
              <span className="text-rose-400">Impostor (Bluff)</span>
            ) : (
              lang === "ta"
                ? activeGame.secretWordTa || activeGame.secretWord
                : lang === "hi"
                ? activeGame.secretWordHi || activeGame.secretWord
                : activeGame.secretWord
            )}
          </div>
        </div>

        <div
          className={`bg-zinc-900 border rounded-3xl p-5 shadow-xl flex items-center justify-between transition-colors ${
            timeLeft <= 5 ? "border-rose-500/50" : "border-zinc-800"
          }`}
        >
          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Time Remaining
          </div>
          <div className={`text-xl font-black font-mono ${timeLeft <= 5 ? "text-rose-500" : "text-indigo-400"}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Active Turn Header */}
      <div
        className={`p-10 rounded-[2.5rem] border transition-all duration-500 shadow-2xl relative overflow-hidden ${
          isMyTurn
            ? "bg-zinc-900 border-indigo-500/50 shadow-indigo-500/5"
            : "bg-zinc-900/50 border-zinc-800"
        }`}
      >
        {isMyTurn && (
          <div className="absolute top-0 right-0 p-6">
            <Icons.Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
          </div>
        )}

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all ${
            isMyTurn ? "bg-indigo-600 text-white scale-110 shadow-2xl" : "bg-zinc-800 text-zinc-400"
          }`}>
            <AvatarIcon name={currentTurnPlayer?.avatar || "User"} className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              {isMyTurn ? "Your Turn" : currentTurnPlayer?.name}
            </h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              {isMyTurn ? "Provide a strategic clue" : "Is crafting a clue..."}
            </p>
          </div>

          {/* Input Form for Active Player */}
          {isMyTurn && (
            <form onSubmit={handleSubmit} className="w-full pt-4 flex gap-3 max-w-sm">
              <input
                type="text"
                maxLength={40}
                value={clueText}
                onChange={(e) => setClueText(e.target.value)}
                placeholder="TYPE CLUE HERE"
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-2xl px-6 py-4 text-xs font-black text-white focus:outline-none shadow-inner tracking-widest uppercase"
                autoFocus
              />
              <button
                type="submit"
                disabled={!clueText.trim()}
                className="w-14 h-14 bg-white text-black hover:bg-zinc-200 disabled:opacity-20 rounded-2xl shadow-xl transition-all flex items-center justify-center shrink-0 active:scale-95"
              >
                <Icons.Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Clues History Stream */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            Clue History <span className="text-white ml-2">{activeGame.clues.length}</span>
          </h4>
        </div>

        {activeGame.clues.length === 0 ? (
          <div className="py-12 text-center text-[10px] text-zinc-600 font-black uppercase tracking-widest border-2 border-dashed border-zinc-800 rounded-3xl">
            Waiting for initial clue transmission...
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {activeGame.clues.map((c, idx) => (
              <div
                key={idx}
                className="p-5 bg-zinc-950/50 border border-zinc-800/50 rounded-3xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-500 group"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-indigo-500/30 transition-colors">
                    <AvatarIcon name={c.avatar} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-0.5">{c.name}</span>
                    <span className="text-sm font-black text-white tracking-tight italic uppercase">&quot;{c.text}&quot;</span>
                  </div>
                </div>
                <div className="text-[8px] text-zinc-700 font-black font-mono bg-zinc-900 px-2 py-1 rounded-lg">
                  TRN_{idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
