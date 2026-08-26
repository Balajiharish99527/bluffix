"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";

interface JoinRoomModalProps {
  lang: Language;
  onClose: () => void;
  onJoin: (code: string) => void;
  error?: string | null;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ lang, onClose, onJoin, error }) => {
  const t = translations[lang];
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    sounds.playClick();
    onJoin(code.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl space-y-10 text-white animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-30"></div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              Access Code<span className="text-cyan-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Authenticate to join session</p>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              Protocol Key
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="INPUT CODE"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-3xl px-6 py-6 text-center text-4xl font-black tracking-[0.3em] text-white uppercase placeholder:text-zinc-900 focus:outline-none transition-all shadow-inner font-mono"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-500/5 border border-rose-500/30 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={code.length < 3}
            className="w-full py-6 bg-white text-black hover:bg-zinc-200 disabled:opacity-20 font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center space-x-3 italic"
          >
            <Icons.LogIn className="w-5 h-5 not-italic" />
            <span>Establish Uplink</span>
          </button>
        </form>
      </div>
    </div>
  );
};
