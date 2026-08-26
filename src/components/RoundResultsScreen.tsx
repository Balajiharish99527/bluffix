"use client";

import React, { useEffect } from "react";
import * as Icons from "lucide-react";
import { ActiveGame, PlayerState, RoomState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";

interface RoundResultsScreenProps {
  room: RoomState;
  activeGame: ActiveGame;
  currentUserId: string;
  lang: Language;
  onNextRound: () => void;
}

export const RoundResultsScreen: React.FC<RoundResultsScreenProps> = ({
  room,
  activeGame,
  currentUserId,
  lang,
  onNextRound,
}) => {
  const t = translations[lang];

  const isHost = room.hostUserId === currentUserId;
  const isCiviliansWin = activeGame.roundWinnerTeam === "civilians";

  useEffect(() => {
    sounds.stopAmbient();
  }, []);

  useEffect(() => {
    const myRole = activeGame.playerRoles[currentUserId];
    const iWon = (isCiviliansWin && myRole === "civilian") || (!isCiviliansWin && myRole === "impostor");
    if (iWon) {
      sounds.playVictory();
    } else {
      sounds.playDefeat();
    }
  }, [isCiviliansWin, activeGame.playerRoles, currentUserId]);

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 animate-in zoom-in-95 duration-700">
      {/* Round Winner Banner */}
      <div
        className={`p-10 rounded-[2.5rem] border shadow-2xl text-center space-y-6 relative overflow-hidden ${
          isCiviliansWin
            ? "bg-zinc-900 border-emerald-500/30 shadow-emerald-500/5"
            : "bg-zinc-900 border-rose-500/30 shadow-rose-500/5"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 transition-all duration-700 shadow-2xl ${
            isCiviliansWin ? "border-emerald-500/50 shadow-emerald-500/20" : "border-rose-500/50 shadow-rose-500/20"
          }`}>
            <img
              src={
                isCiviliansWin
                  ? "/images/civilian.jfif"
                  : "/images/impostor.jfif"
              }
              alt="Round Outcome"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              {isCiviliansWin ? "Civilians Win" : "Impostors Win"}<span className={isCiviliansWin ? "text-emerald-500 not-italic" : "text-rose-500 not-italic"}>.</span>
            </h2>
            {activeGame.aiRoundRecap ? (
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed italic">
                &quot;{activeGame.aiRoundRecap}&quot;
              </p>
            ) : activeGame.roundSummaryMessage && (
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                {activeGame.roundSummaryMessage}
              </p>
            )}
          </div>
        </div>

        {/* Secret Word Card */}
        <div className="relative group max-w-sm mx-auto">
          <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-10"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-1">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] block">
              Keyword Decrypted
            </span>
            <span className="text-2xl font-black text-white uppercase italic tracking-tight">
              {lang === "ta"
                ? activeGame.secretWordTa || activeGame.secretWord
                : lang === "hi"
                ? activeGame.secretWordHi || activeGame.secretWord
                : activeGame.secretWord}
            </span>
          </div>
        </div>
      </div>

      {/* Scoreboard & Points Earned This Round */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            Standings <span className="text-white ml-2">Round {room.settings.currentRound} / {room.settings.numRounds}</span>
          </h4>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
          {room.players.map((p) => {
            const role = activeGame.playerRoles[p.userId];
            const ptsEarned = activeGame.roundPoints[p.userId] || 0;

            return (
              <div
                key={p.userId}
                className="p-5 bg-zinc-950/50 border border-zinc-800/50 rounded-3xl flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                    <AvatarIcon name={p.avatar} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white tracking-tight uppercase italic">{p.name}</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${
                        role === "impostor" ? "text-rose-500" : role === "liar" ? "text-cyan-500" : "text-emerald-500"
                      }`}>
                        {role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-white tracking-tighter">{p.score} pts</span>
                  {ptsEarned > 0 && (
                    <span className="text-[9px] font-black text-emerald-500 block uppercase tracking-widest mt-0.5">+{ptsEarned} Network Bonus</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Host Controls */}
      <div className="flex justify-center pt-4">
        {isHost ? (
          <button
            onClick={() => { sounds.playClick(); onNextRound(); }}
            className="w-full max-w-sm py-6 bg-white text-black hover:bg-zinc-200 font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3"
          >
            <span>{room.settings.currentRound < room.settings.numRounds ? "Advance Transmission" : "Final Analytics"}</span>
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full max-w-sm py-6 bg-zinc-900 border border-zinc-800 text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.5rem] flex items-center justify-center">
            Waiting for host authorization
          </div>
        )}
      </div>
    </div>
  );
};
