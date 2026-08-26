"use client";

import React, { useEffect, useState } from "react";
import { X, Trophy, Medal, Award, Flame, User, Search, Activity } from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";
import { API_BASE } from "@/lib/apiConfig";

interface LeaderboardItem {
  id: string;
  username: string;
  avatar: string;
  totalGames: number;
  totalWins: number;
  totalPoints: number;
}

interface LeaderboardModalProps {
  lang: Language;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];
  const [list, setList] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.leaderboard) {
          setList(data.leaderboard);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl space-y-8 text-white animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
              Global Ranks<span className="text-amber-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Top performing network nodes</p>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Activity className="w-8 h-8 text-zinc-700 animate-spin" />
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Syncing Rankings...</span>
          </div>
        ) : list.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Search className="w-8 h-8 text-zinc-800 mx-auto" />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">No ranking data found in database</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[28rem] overflow-y-auto custom-scrollbar pr-2">
            {list.map((item, idx) => {
              let badgeColor = "bg-zinc-950/50 border-zinc-800/50 text-zinc-500";
              let rankIcon = <span className="text-[10px] font-black font-mono">#{idx + 1}</span>;

              if (idx === 0) {
                badgeColor = "bg-amber-500/5 border-amber-500/20 text-amber-400 shadow-xl shadow-amber-500/5";
                rankIcon = <Trophy className="w-4 h-4 text-amber-500" />;
              } else if (idx === 1) {
                badgeColor = "bg-zinc-100/5 border-zinc-100/10 text-zinc-300";
                rankIcon = <Medal className="w-4 h-4 text-zinc-400" />;
              } else if (idx === 2) {
                badgeColor = "bg-amber-900/5 border-amber-900/10 text-amber-700";
                rankIcon = <Medal className="w-4 h-4 text-amber-800" />;
              }

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl border flex items-center justify-between transition-all group ${badgeColor}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-colors group-hover:border-zinc-700">
                      {rankIcon}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <AvatarIcon name={item.avatar} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-xs text-white uppercase italic tracking-tighter truncate max-w-[120px]">
                        {item.username}
                      </div>
                      <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        {item.totalWins} WINS / {item.totalGames} SESS
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-white tracking-tighter block leading-none">
                      {item.totalPoints}
                    </span>
                    <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                      Points
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
