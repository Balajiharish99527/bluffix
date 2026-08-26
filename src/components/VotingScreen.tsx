"use client";

import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { ActiveGame, PlayerState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";

interface VotingScreenProps {
  activeGame: ActiveGame;
  players: PlayerState[];
  currentUserId: string;
  lang: Language;
  onVote: (suspectUserId: string) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  activeGame,
  players,
  currentUserId,
  lang,
  onVote,
}) => {
  const t = translations[lang];
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const hasVoted = Boolean(activeGame.votes[currentUserId]);

  useEffect(() => {
    sounds.playAmbient("voting");
  }, []);

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

  const handleSelect = (targetId: string) => {
    if (hasVoted || targetId === currentUserId) return;
    sounds.playClick();
    setSelectedUserId(targetId);
  };

  const handleConfirmVote = () => {
    if (!selectedUserId || hasVoted) return;
    sounds.playVoteCast();
    onVote(selectedUserId);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Voting Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -mr-10 -mt-10"></div>

        <div className="flex flex-col items-center text-center space-y-4 relative">
          <div className="flex items-center space-x-2 text-rose-500">
            <Icons.Target className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">{t.votingPhase}</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Select The Target<span className="text-rose-500 not-italic">.</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t.voteSuspect}</p>

          {/* Timer */}
          <div className={`mt-4 px-6 py-2 rounded-2xl border transition-colors ${
            timeLeft <= 5 ? "bg-rose-500/10 border-rose-500/30 text-rose-500" : "bg-zinc-950/50 border-zinc-800 text-white"
          }`}>
            <span className="text-xl font-black font-mono">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Player Suspect Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {players.map((p) => {
          const isSelf = p.userId === currentUserId;
          const isSelected = selectedUserId === p.userId;
          const pHasVoted = Boolean(activeGame.votes[p.userId]);

          return (
            <button
              key={p.userId}
              disabled={hasVoted || isSelf}
              onClick={() => handleSelect(p.userId)}
              className={`p-5 rounded-[2rem] border text-left transition-all relative overflow-hidden flex items-center justify-between group ${
                isSelf
                  ? "bg-zinc-950/40 border-zinc-900 text-zinc-700 opacity-40 cursor-not-allowed"
                  : isSelected
                  ? "bg-rose-500/10 border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.02]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                  isSelected ? "bg-rose-600 text-white" : "bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700"
                }`}>
                  <AvatarIcon name={p.avatar} className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-white tracking-tight">{p.name}</span>
                    {isSelf && (
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">Non-Target</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                {pHasVoted && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" title="Voted"></div>
                )}
                {isSelected && (
                  <Icons.CheckCircle2 className="w-6 h-6 text-rose-500 animate-in zoom-in duration-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm Vote Button */}
      <div className="flex justify-center pt-4">
        {!hasVoted ? (
          <button
            onClick={handleConfirmVote}
            disabled={!selectedUserId}
            className="w-full max-w-sm py-6 bg-white text-black hover:bg-zinc-200 disabled:opacity-20 font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3"
          >
            <Icons.Target className="w-4 h-4" />
            <span>Confirm Elimination Vote</span>
          </button>
        ) : (
          <div className="w-full max-w-sm py-6 bg-zinc-900 border border-zinc-800 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] flex items-center justify-center space-x-3">
            <Icons.CheckCircle2 className="w-4 h-4" />
            <span>Target Verified / Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};
