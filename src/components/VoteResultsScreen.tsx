"use client";

import React, { useEffect } from "react";
import * as Icons from "lucide-react";
import { ActiveGame, PlayerState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";

interface VoteResultsScreenProps {
  activeGame: ActiveGame;
  players: PlayerState[];
  currentUserId: string;
  lang: Language;
}

export const VoteResultsScreen: React.FC<VoteResultsScreenProps> = ({
  activeGame,
  players,
  currentUserId,
  lang,
}) => {
  const t = translations[lang];

  const suspectedPlayer = players.find((p) => p.userId === activeGame.suspectedUserId);
  const suspectedRole = activeGame.suspectedUserId
    ? activeGame.playerRoles[activeGame.suspectedUserId]
    : null;

  useEffect(() => {
    sounds.stopAmbient();
    sounds.playRoleReveal(suspectedRole === "impostor");
  }, [suspectedRole]);

  return (
    <div className={`max-w-2xl mx-auto w-full space-y-6 animate-in zoom-in-95 duration-700 ${(!activeGame.isTie && (suspectedRole === "impostor" || suspectedRole === "liar")) ? "glitch-breach" : ""}`}>
      {(!activeGame.isTie && (suspectedRole === "impostor" || suspectedRole === "liar")) && <div className="scanline" />}
      {/* Highest Voted Elimination Card */}
      <div
        className={`p-10 rounded-[2.5rem] border shadow-2xl text-center space-y-6 relative overflow-hidden ${
          activeGame.isTie
            ? "bg-zinc-900 border-zinc-800"
            : suspectedRole === "impostor" || suspectedRole === "liar"
            ? "bg-zinc-900 border-emerald-500/30 shadow-emerald-500/5"
            : "bg-zinc-900 border-rose-500/30 shadow-rose-500/5"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <Icons.Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.voteResult}</span>
          </div>

          {!activeGame.isTie && suspectedPlayer ? (
            <div className="space-y-6">
              <div className="relative inline-flex">
                <div className={`absolute -inset-4 rounded-3xl blur opacity-30 ${
                  suspectedRole === "impostor" || suspectedRole === "liar" ? "bg-emerald-500" : "bg-rose-500"
                }`}></div>
                <div className={`relative w-24 h-24 rounded-3xl flex items-center justify-center border-2 shadow-2xl ${
                  suspectedRole === "impostor" || suspectedRole === "liar"
                    ? "bg-zinc-900 border-emerald-500 text-emerald-500"
                    : "bg-zinc-900 border-rose-500 text-rose-500"
                }`}>
                  <AvatarIcon name={suspectedPlayer.avatar} className="w-12 h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                  {suspectedPlayer.name} Found Guilty<span className={suspectedRole === "impostor" || suspectedRole === "liar" ? "text-emerald-500 not-italic" : "text-rose-500 not-italic"}>.</span>
                </h2>
                <div
                  className={`inline-block px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${
                    suspectedRole === "impostor" || suspectedRole === "liar"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {suspectedRole === "impostor"
                    ? "Target Identified: Impostor"
                    : suspectedRole === "liar"
                    ? "Target Identified: Liar"
                    : "Target Misidentified: Civilian"}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto">
                <Icons.Target className="w-10 h-10 text-zinc-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Tie Verdict<span className="text-indigo-500 not-italic">.</span></h2>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Insufficient evidence to convict a target</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Vote Breakdown List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
          Transmission Breakdown
        </h4>

        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          {activeGame.revealedVotes && activeGame.revealedVotes.length > 0 ? (
            activeGame.revealedVotes.map((v, idx) => (
              <div
                key={idx}
                className="p-5 bg-zinc-950/50 border border-zinc-800/50 rounded-3xl flex items-center justify-between group"
              >
                <span className="text-xs font-black text-zinc-200 uppercase tracking-tighter italic">{v.voterName}</span>
                <div className="flex items-center space-x-4">
                  <div className="h-[1px] w-8 bg-zinc-800 group-hover:bg-indigo-500/50 transition-colors"></div>
                  <Icons.ArrowRight className="w-3.5 h-3.5 text-zinc-700" />
                  <div className="h-[1px] w-8 bg-zinc-800 group-hover:bg-indigo-500/50 transition-colors"></div>
                </div>
                <span className="text-xs font-black text-rose-400 bg-rose-500/5 border border-rose-500/20 px-4 py-1.5 rounded-2xl uppercase italic tracking-tighter">
                  {v.suspectName}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-[10px] text-zinc-600 font-black uppercase tracking-widest py-10 border-2 border-dashed border-zinc-800 rounded-3xl">
              No voting data received
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
