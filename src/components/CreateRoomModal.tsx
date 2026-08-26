"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/words";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { CategoryIcon } from "@/components/CategoryIcon";

interface CreateRoomModalProps {
  lang: Language;
  onClose: () => void;
  onCreate: (settings: {
    gameMode: "classic" | "multi_impostor" | "find_liar";
    categoryId: string;
    difficulty: "easy" | "medium" | "hard";
    numRounds: number;
    numImpostors: number;
    clueTimer: number;
    discussionTimer: number;
    votingTimer: number;
    maxPlayers: number;
    isAiMode: boolean;
  }) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ lang, onClose, onCreate }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);

  const [gameMode, setGameMode] = useState<"classic" | "multi_impostor" | "find_liar">("classic");
  const [categoryId, setCategoryId] = useState<string>("food");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numRounds, setNumRounds] = useState<number>(3);
  const [numImpostors, setNumImpostors] = useState<number>(1);
  const [clueTimer, setClueTimer] = useState<number>(45);
  const [discussionTimer, setDiscussionTimer] = useState<number>(60);
  const [votingTimer, setVotingTimer] = useState<number>(30);
  const [maxPlayers, setMaxPlayers] = useState<number>(8);
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    sounds.playClick();
    try {
      await onCreate({
        gameMode,
        categoryId,
        difficulty,
        numRounds,
        numImpostors,
        clueTimer,
        discussionTimer,
        votingTimer,
        maxPlayers,
        isAiMode,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl space-y-10 text-white animate-in zoom-in-95 duration-300 my-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-30"></div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              New Session<span className="text-indigo-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Configure environment parameters</p>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Game Mode */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Protocol Selection
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "classic", icon: Icons.Target, title: t.classicMode, desc: "Standard 1 Impostor" },
                { id: "multi_impostor", icon: Icons.Zap, title: t.multiImpostorMode, desc: "Team Infiltration" },
                { id: "find_liar", icon: Icons.Ghost, title: t.findLiarMode, desc: "Asymmetric Data" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setGameMode(m.id as any);
                    if (m.id === "multi_impostor") setNumImpostors(2);
                    else setNumImpostors(1);
                  }}
                  className={`p-6 rounded-[1.5rem] border text-left transition-all group ${
                    gameMode === m.id
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/10"
                      : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50"
                  }`}
                >
                  <m.icon className={`w-6 h-6 mb-4 transition-colors ${gameMode === m.id ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                  <div className="font-black text-xs uppercase tracking-tight">{m.title}</div>
                  <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${gameMode === m.id ? "text-indigo-200" : "text-zinc-600"}`}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Database Module
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 max-h-56 overflow-y-auto gap-3 p-4 border border-zinc-800 rounded-3xl bg-zinc-950/50 custom-scrollbar">
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { sounds.playClick(); setCategoryId(cat.id); }}
                  className={`p-5 rounded-2xl border transition-all flex flex-col items-center text-center space-y-3 ${
                    categoryId === cat.id
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/10 scale-[1.02]"
                      : cat.id === "random"
                      ? "bg-zinc-950/80 border-zinc-800 text-amber-400 hover:border-amber-500/30"
                      : "bg-zinc-900 border-zinc-800/50 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <CategoryIcon name={cat.icon} className={`w-5 h-5 ${
                    categoryId === cat.id ? "text-white" : cat.id === "random" ? "text-amber-500 animate-pulse" : "text-zinc-600"
                  }`} />
                  <div className="text-[9px] font-black uppercase tracking-widest leading-tight">
                    {lang === "ta" ? cat.nameTa : lang === "hi" ? cat.nameHi : cat.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Iteration Count</label>
                <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-2xl">
                  {[1, 3, 5, 7].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNumRounds(r)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${numRounds === r ? "bg-zinc-800 text-white shadow-md" : "text-zinc-600 hover:text-zinc-400"}`}
                    >
                      {r} RND
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Node Capacity</label>
                <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-2xl">
                  {[4, 6, 8, 12].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMaxPlayers(m)}
                      className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${maxPlayers === m ? "bg-zinc-800 text-white shadow-md" : "text-zinc-600 hover:text-zinc-400"}`}
                    >
                      {m} PLR
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-zinc-950/50 border border-zinc-800 p-6 rounded-[2rem]">
              <div className="flex items-center justify-between text-indigo-400 mb-2">
                <div className="flex items-center space-x-3">
                  <Icons.Brain className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Intelligence</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiMode(!isAiMode)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isAiMode ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isAiMode ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Input Window</span>
                  <span className="text-[10px] font-black text-white font-mono">{clueTimer}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Processing Phase</span>
                  <span className="text-[10px] font-black text-white font-mono">{discussionTimer}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Elimination Cycle</span>
                  <span className="text-[10px] font-black text-white font-mono">{votingTimer}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-white text-black hover:bg-zinc-200 disabled:opacity-20 font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center space-x-4 italic"
            >
              {loading ? (
                <Icons.Cpu className="w-5 h-5 animate-spin" />
              ) : (
                <Icons.Cpu className="w-5 h-5 fill-current not-italic" />
              )}
              <span>{loading ? "INITIALIZING..." : "Initialize Environment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
