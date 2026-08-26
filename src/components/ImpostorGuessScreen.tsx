"use client";

import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { ActiveGame, PlayerState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";

interface ImpostorGuessScreenProps {
  activeGame: ActiveGame;
  players: PlayerState[];
  currentUserId: string;
  lang: Language;
  onSubmitGuess: (guess: string) => void;
}

export const ImpostorGuessScreen: React.FC<ImpostorGuessScreenProps> = ({
  activeGame,
  players,
  currentUserId,
  lang,
  onSubmitGuess,
}) => {
  const t = translations[lang];
  const [guess, setGuess] = useState("");
  const [timeLeft, setTimeLeft] = useState(25);

  const isImpostor = activeGame.playerRoles[currentUserId] === "impostor";

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
    if (!guess.trim() || !isImpostor) return;
    sounds.playClick();
    onSubmitGuess(guess.trim());
  };

  return (
    <div className="max-w-md mx-auto w-full space-y-6 animate-in zoom-in-95 duration-700">
      <div className="bg-zinc-900 border border-rose-500/30 rounded-[3rem] p-10 shadow-2xl text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-transparent to-rose-500 opacity-30"></div>

        <div className="w-24 h-24 rounded-[2rem] bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-500/5 transition-transform duration-500 hover:scale-105">
          <Icons.Key className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Override Initialized<span className="text-rose-500 not-italic">.</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
            {isImpostor
              ? t.impostorGuessInstruction
              : "Accessing database... Impostor is attempting to guess the secret keyword."}
          </p>
        </div>

        {/* Timer */}
        <div className={`inline-flex items-center px-6 py-2 rounded-2xl border transition-colors ${
          timeLeft <= 5 ? "bg-rose-500/10 border-rose-500/40 text-rose-500" : "bg-zinc-950/50 border-zinc-800 text-white"
        }`}>
          <span className="text-xl font-black font-mono">{timeLeft}s</span>
        </div>

        {/* Impostor Guess Form */}
        {isImpostor ? (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <input
              type="text"
              maxLength={40}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="INPUT WORD"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-500 rounded-2xl px-6 py-5 text-center text-xl font-black text-white focus:outline-none placeholder:text-zinc-800 shadow-inner tracking-widest uppercase"
              autoFocus
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="w-full py-5 bg-white text-black hover:bg-zinc-200 disabled:opacity-20 font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <Icons.Zap className="w-4 h-4" />
              <span>Submit Override</span>
            </button>
          </form>
        ) : (
          <div className="p-8 bg-zinc-950/50 rounded-3xl border border-dashed border-zinc-800 text-[10px] font-black text-zinc-600 uppercase tracking-widest animate-pulse">
            Monitoring override attempt...
          </div>
        )}
      </div>
    </div>
  );
};
