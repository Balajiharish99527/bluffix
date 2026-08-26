"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import * as Icons from "lucide-react";
import { RoomState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";

interface FinalResultsScreenProps {
  room: RoomState;
  currentUserId: string;
  lang: Language;
  onPlayAgain: () => void;
  onLeave: () => void;
}

export const FinalResultsScreen: React.FC<FinalResultsScreenProps> = ({
  room,
  currentUserId,
  lang,
  onPlayAgain,
  onLeave,
}) => {
  const t = translations[lang];

  // Sort players by final score
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    sounds.playVictory();
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#6366f1', '#a855f7', '#ffffff']
      });
    } catch {
      // ignore
    }
  }, []);

  const handleShareResult = async () => {
    sounds.playClick();
    const text = `🏆 I just finished a game of BLUFFIX! Winner: ${winner?.name} with ${winner?.score} points. Join the fun at ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "BLUFFIX Game Results",
          text: text,
          url: window.location.origin,
        });
      } catch {
        navigator.clipboard.writeText(text);
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8 animate-in zoom-in-95 duration-1000">
      {/* Winner Hero Card */}
      <div className="bg-zinc-900 border border-amber-500/30 rounded-[3rem] p-12 shadow-2xl text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -ml-32 -mb-32"></div>

        <button
          onClick={handleShareResult}
          className="absolute top-8 right-8 p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50 group shadow-xl"
        >
          <Icons.Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <div className="flex flex-col items-center space-y-6 relative">
          <div className="relative">
            <div className="absolute -inset-6 bg-amber-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-32 h-32 rounded-[2.5rem] bg-zinc-950 border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-500/10">
              <Icons.Crown className="w-16 h-16" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Icons.Star className="w-5 h-5 fill-current" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase block">
              CHAMPION_DETECTED
            </span>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              {winner?.name}<span className="text-amber-500 not-italic">.</span>
            </h2>
            <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-zinc-800 px-6 py-2 rounded-2xl mt-4">
              <span className="text-xl font-black text-white tracking-tighter">{winner?.score}</span>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Aggregate Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Podium Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-xl space-y-8">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] text-center">
          Network Standings Breakdown
        </h4>

        <div className="space-y-4">
          {sortedPlayers.map((p, idx) => {
            let badgeStyle = "bg-zinc-950/50 border-zinc-800 text-zinc-400";
            let rankBadge = <span className="text-[10px] font-black font-mono">#{idx + 1}</span>;

            if (idx === 0) {
              badgeStyle = "bg-amber-500/5 border-amber-500/30 text-amber-200 shadow-xl shadow-amber-500/5";
              rankBadge = <Icons.Medal className="w-5 h-5 text-amber-400" />;
            } else if (idx === 1) {
              badgeStyle = "bg-zinc-800 border-zinc-700 text-zinc-200";
              rankBadge = <Icons.Medal className="w-5 h-5 text-zinc-400" />;
            } else if (idx === 2) {
              badgeStyle = "bg-amber-900/5 border-amber-900/30 text-amber-600";
              rankBadge = <Icons.Medal className="w-5 h-5 text-amber-700" />;
            }

            return (
              <div
                key={p.userId}
                className={`p-6 rounded-3xl border flex items-center justify-between transition-all group ${badgeStyle}`}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/30 transition-colors">
                    {rankBadge}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <AvatarIcon name={p.avatar} className="w-6 h-6" />
                    </div>
                    <span className="font-black text-base text-white tracking-tight uppercase italic">{p.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-white tracking-tighter">{p.score}</span>
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mt-0.5">PTS</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => { sounds.playClick(); onLeave(); }}
          className="flex-1 py-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] border border-zinc-800 transition-all flex items-center justify-center space-x-3"
        >
          <Icons.Home className="w-4 h-4" />
          <span>Exit To Base</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); onPlayAgain(); }}
          className="flex-1 py-6 bg-white text-black hover:bg-zinc-200 font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3"
        >
          <Icons.RotateCcw className="w-4 h-4" />
          <span>Re-Initialize Session</span>
        </button>
      </div>
    </div>
  );
};
