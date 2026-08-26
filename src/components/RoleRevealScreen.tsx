"use client";

import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { ActiveGame } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";

interface RoleRevealScreenProps {
  activeGame: ActiveGame;
  currentUserId: string;
  lang: Language;
}

export const RoleRevealScreen: React.FC<RoleRevealScreenProps> = ({
  activeGame,
  currentUserId,
  lang,
}) => {
  const t = translations[lang];
  const [revealed, setRevealed] = useState(false);

  const myRole = activeGame.playerRoles[currentUserId] || "civilian";
  const isImpostor = myRole === "impostor";
  const isLiar = myRole === "liar";

  useEffect(() => {
    sounds.playRoleReveal(isImpostor || isLiar);
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [isImpostor, isLiar]);

  return (
    <div className="max-w-md mx-auto w-full text-center space-y-8 animate-in zoom-in-95 duration-700">
      {/* Header Badge */}
      <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-2xl text-[10px] font-black text-zinc-400 uppercase tracking-widest">
        <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Round {activeGame.roundNumber} of {activeGame.totalRounds}</span>
      </div>

      {/* Role Card */}
      <div
        className={`rounded-[3rem] p-10 border transition-all duration-1000 transform ${
          revealed ? "scale-100 rotate-0 translate-y-0" : "scale-90 rotate-2 translate-y-10 opacity-0"
        } ${
          isImpostor
            ? "bg-zinc-900 border-rose-500/30 shadow-2xl shadow-rose-500/5"
            : isLiar
            ? "bg-zinc-900 border-cyan-500/30 shadow-2xl shadow-cyan-500/5"
            : "bg-zinc-900 border-indigo-500/30 shadow-2xl shadow-indigo-500/5"
        }`}
      >
        <div className="space-y-8">
          {/* Image Container */}
          <div className="flex justify-center">
            <div
              className={`w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 transition-all duration-700 shadow-2xl ${
                isImpostor
                  ? "border-rose-500/50 shadow-rose-500/20"
                  : isLiar
                  ? "border-cyan-500/50 shadow-cyan-500/20"
                  : "border-indigo-500/50 shadow-indigo-500/20"
              }`}
            >
              <img
                src={
                  isImpostor
                    ? "/images/impostor.jfif"
                    : isLiar
                    ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=400&auto=format&fit=crop"
                    : "/images/civilian.jfif"
                }
                alt="Role Identity"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
            </div>
          </div>

          {/* Role Title */}
          <div className="space-y-2">
            <h2
              className={`text-3xl font-black tracking-tighter uppercase italic ${
                isImpostor
                  ? "text-rose-400"
                  : isLiar
                  ? "text-cyan-400"
                  : "text-white"
              }`}
            >
              {isImpostor
                ? t.youAreImpostor
                : isLiar
                ? t.youAreLiar
                : t.youAreCivilian}
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed px-4">
              {isImpostor
                ? t.impostorInstruction
                : isLiar
                ? t.liarInstruction
                : "Match clues with fellow Civilians and spot the outlier!"}
            </p>
          </div>

          {/* Secret Word Box */}
          <div className="space-y-4">
            {activeGame.aiBriefing && (
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                <p className="text-[9px] font-black text-indigo-400/80 uppercase tracking-widest leading-relaxed italic">
                  &quot;{activeGame.aiBriefing}&quot;
                </p>
              </div>
            )}

            <div className="relative group">
              <div className={`absolute -inset-1 rounded-3xl blur opacity-20 transition duration-1000 ${
                isImpostor ? "bg-rose-500" : isLiar ? "bg-cyan-500" : "bg-indigo-500"
              }`}></div>
              <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-2 overflow-hidden">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block">
                  {t.secretWordIs}
                </span>

                {!isImpostor ? (
                  <span className="text-3xl font-black tracking-tighter text-white uppercase italic">
                    {lang === "ta"
                      ? activeGame.secretWordTa || activeGame.secretWord
                      : lang === "hi"
                      ? activeGame.secretWordHi || activeGame.secretWord
                      : activeGame.secretWord}
                  </span>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-rose-500/40 animate-pulse"></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                      Word Hidden
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] animate-pulse">
        Clue turn commencing shortly...
      </div>
    </div>
  );
};
