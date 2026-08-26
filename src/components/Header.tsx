"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { sounds } from "@/lib/audio";
import { Language, translations } from "@/lib/i18n";
import { AvatarIcon } from "@/components/AvatarIcon";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenProfile: () => void;
  user: { username: string; avatar: string; totalPoints: number } | null;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOpenHowToPlay,
  onOpenLeaderboard,
  onOpenProfile,
  user,
}) => {
  const [soundOn, setSoundOn] = useState(sounds.isSoundEnabled());
  const [hapticOn, setHapticOn] = useState(sounds.isHapticEnabled());
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = translations[lang];

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundOn(newState);
    if (newState) sounds.playClick();
  };

  return (
    <header className="w-full bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-900 text-white px-6 py-4 sticky top-0 z-40 flex items-center justify-between shadow-2xl">
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
            <Icons.Smartphone className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
            {t.gameTitle}<span className="text-indigo-500 not-italic">.</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase hidden sm:block">
            {t.gameSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* User Pill */}
        {user && (
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-2xl transition-all shadow-inner group"
          >
            <div className="w-7 h-7 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <AvatarIcon name={user.avatar} className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-black text-zinc-200 max-w-[100px] truncate">{user.username}</span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider">
                {user.totalPoints} {t.points}
              </span>
            </div>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
          <button
            onClick={onOpenLeaderboard}
            className="p-2.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-all"
          >
            <Icons.Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="p-2.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 transition-all"
          >
            <Icons.HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-xl transition-all ${
              soundOn ? "text-emerald-400" : "text-zinc-600"
            } hover:bg-zinc-800`}
          >
            {soundOn ? <Icons.Volume2 className="w-4 h-4" /> : <Icons.VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-2xl transition-all text-zinc-400 hover:text-white"
          >
            <Icons.Languages className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase">{lang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-3 w-40 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              {["en", "ta", "hi"].map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    onLanguageChange(l as Language);
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors hover:bg-zinc-800 flex items-center justify-between ${
                    lang === l ? "text-indigo-400 bg-indigo-500/5" : "text-zinc-400"
                  }`}
                >
                  <span className="uppercase">{l === "en" ? "English" : l === "ta" ? "தமிழ்" : "हिंदी"}</span>
                  <span className="text-[10px] opacity-50 uppercase">{l}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
