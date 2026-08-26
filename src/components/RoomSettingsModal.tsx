"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/words";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { RoomState } from "@/lib/roomManager";
import { CategoryIcon } from "@/components/CategoryIcon";

interface RoomSettingsModalProps {
  lang: Language;
  currentSettings: RoomState["settings"];
  onClose: () => void;
  onSave: (settings: Partial<RoomState["settings"]>) => void;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({
  lang,
  currentSettings,
  onClose,
  onSave,
}) => {
  const t = translations[lang];

  const [gameMode, setGameMode] = useState(currentSettings.gameMode);
  const [categoryId, setCategoryId] = useState(currentSettings.categoryId);
  const [difficulty, setDifficulty] = useState(currentSettings.difficulty);
  const [numRounds, setNumRounds] = useState(currentSettings.numRounds);
  const [numImpostors, setNumImpostors] = useState(currentSettings.numImpostors);
  const [clueTimer, setClueTimer] = useState(currentSettings.clueTimer);
  const [discussionTimer, setDiscussionTimer] = useState(currentSettings.discussionTimer);
  const [votingTimer, setVotingTimer] = useState(currentSettings.votingTimer);
  const [maxPlayers, setMaxPlayers] = useState(currentSettings.maxPlayers);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    onSave({
      gameMode,
      categoryId,
      difficulty,
      numRounds,
      numImpostors,
      clueTimer,
      discussionTimer,
      votingTimer,
      maxPlayers,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl space-y-8 text-white animate-in zoom-in-95 duration-300 my-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              Config<span className="text-indigo-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Modify active room protocol</p>
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
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Protocol</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "classic", icon: Icons.Target, title: "Classic" },
                { id: "multi_impostor", icon: Icons.Zap, title: "Multi" },
                { id: "find_liar", icon: Icons.Ghost, title: "Liar" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setGameMode(m.id as any);
                    if (m.id === "multi_impostor") if (numImpostors < 2) setNumImpostors(2);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all group ${
                    gameMode === m.id
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-lg"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <m.icon className={`w-5 h-5 mb-3 ${gameMode === m.id ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                  <div className="font-black text-xs uppercase tracking-tight">{m.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Data Module</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 max-h-48 overflow-y-auto gap-2 p-3 border border-zinc-800 rounded-3xl bg-zinc-950/50 custom-scrollbar">
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { sounds.playClick(); setCategoryId(cat.id); }}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center space-y-2 ${
                    categoryId === cat.id
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]"
                      : cat.id === "random"
                      ? "bg-zinc-950/80 border-zinc-800 text-amber-400 hover:border-amber-500/30"
                      : "bg-zinc-900 border-zinc-800/50 text-zinc-600 hover:border-zinc-700"
                  }`}
                >
                  <CategoryIcon name={cat.icon} className={`w-4 h-4 ${
                    categoryId === cat.id ? "text-white" : cat.id === "random" ? "text-amber-500 animate-pulse" : "text-zinc-600"
                  }`} />
                  <span className="text-[8px] font-black uppercase tracking-widest truncate w-full text-center">
                    {lang === "ta" ? cat.nameTa : lang === "hi" ? cat.nameHi : cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Rounds", value: numRounds, options: [1, 3, 5, 7], setter: setNumRounds },
              { label: "Max Plr", value: maxPlayers, options: [4, 6, 8, 12], setter: setMaxPlayers },
              { label: "Input", value: clueTimer, options: [30, 45, 60], setter: setClueTimer },
              { label: "Vote", value: votingTimer, options: [20, 30, 45], setter: setVotingTimer },
            ].map((cfg) => (
              <div key={cfg.label} className="space-y-2">
                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{cfg.label}</label>
                <select
                  value={cfg.value}
                  onChange={(e) => cfg.setter(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-black text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {cfg.options.map(o => <option key={cfg.label + o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center space-x-3"
          >
            <Icons.Save className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
