"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";

interface HowToPlayModalProps {
  lang: Language;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"classic" | "multi" | "liar">("classic");

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl space-y-10 text-white animate-in zoom-in-95 duration-300 my-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-30"></div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              Game Manual<span className="text-indigo-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Operational procedures & rules</p>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
          {[
            { id: "classic", title: "Classic", color: "bg-indigo-600" },
            { id: "multi", title: "Multi", color: "bg-purple-600" },
            { id: "liar", title: "Liar", color: "bg-cyan-600" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] transition-all ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-xl`
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8 min-h-[16rem]">
          {activeTab === "classic" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl text-zinc-200 text-xs font-black uppercase tracking-widest leading-relaxed italic italic">
                &quot;{t.rulesClassic}&quot;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "01. Initialization", desc: "Civilians receive the target keyword. The Impostor connection is masked." },
                  { title: "02. Transmission", desc: "Players provide single-word clues. Bluffing is required for outliers." },
                  { title: "03. Analytics", desc: "Analyze data streams for suspicious behavior and inconsistencies." },
                  { title: "04. Termination", desc: "Vote to eliminate the threat. High-risk targets get one override guess." },
                ].map((step) => (
                  <div key={step.title} className="space-y-2">
                    <div className="flex items-center space-x-2 text-indigo-400">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{step.title}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-black uppercase tracking-wider">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "multi" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-3xl text-zinc-200 text-xs font-black uppercase tracking-widest leading-relaxed italic italic">
                &quot;{t.rulesMulti}&quot;
              </p>
              <div className="flex items-start space-x-4 p-6 bg-zinc-950/50 border border-zinc-800 rounded-3xl">
                <Icons.Shield className="w-8 h-8 text-purple-500 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Peer Recognition</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed font-black">Co-Impostors have shared network visibility. Coordinate clues to maximize infiltration success.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "liar" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl text-zinc-200 text-xs font-black uppercase tracking-widest leading-relaxed italic italic">
                &quot;{t.rulesLiar}&quot;
              </p>
              <div className="flex items-start space-x-4 p-6 bg-zinc-950/50 border border-zinc-800 rounded-3xl">
                <Icons.Ghost className="w-8 h-8 text-cyan-500 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Signal Variance</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed font-black">The Outlier (Liar) receives a modified prompt. Identify the subtle variance in their data output.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
