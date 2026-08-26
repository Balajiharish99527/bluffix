"use client";

import React, { useState } from "react";
import { X, User, Edit3, Save, Flame, Trophy, Shield, Zap, Target, Crown, Ghost, Sword, Heart, Star, Moon, Sun, Anchor } from "lucide-react";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";

interface ProfileModalProps {
  lang: Language;
  user: {
    id: string;
    guestId: string;
    username: string;
    avatar: string;
    totalGames: number;
    totalWins: number;
    totalPoints: number;
  };
  onClose: () => void;
  onUpdate: (username: string, avatar: string) => void;
}

const AVATARS = [
  { id: "User", icon: User },
  { id: "Shield", icon: Shield },
  { id: "Zap", icon: Zap },
  { id: "Target", icon: Target },
  { id: "Ghost", icon: Ghost },
  { id: "Sword", icon: Sword },
  { id: "Heart", icon: Heart },
  { id: "Star", icon: Star },
  { id: "Moon", icon: Moon },
  { id: "Sun", icon: Sun },
  { id: "Anchor", icon: Anchor },
  { id: "Flame", icon: Flame },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  lang,
  user,
  onClose,
  onUpdate,
}) => {
  const t = translations[lang];
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar || "User");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    sounds.playClick();
    onUpdate(username.trim(), avatar);
    onClose();
  };

  const winRate = user.totalGames > 0 ? Math.round((user.totalWins / user.totalGames) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl space-y-8 text-white animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">
              Profile<span className="text-indigo-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Customize your identity</p>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 mb-2 block uppercase tracking-[0.2em]">
              {t.avatar}
            </label>
            <div className="grid grid-cols-4 gap-3 p-4 bg-zinc-950/50 border border-zinc-800 rounded-3xl">
              {AVATARS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAvatar(id);
                  }}
                  className={`flex items-center justify-center p-4 rounded-2xl border transition-all ${
                    avatar === id
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20 scale-105"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          {/* Nickname input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 mb-1 block uppercase tracking-[0.2em]">
              {t.nickname}
            </label>
            <input
              type="text"
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-2xl px-6 py-4 text-sm font-black text-white focus:outline-none transition-all placeholder:text-zinc-700 shadow-inner"
              placeholder="Enter your name"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50 text-center">
              <span className="text-lg font-black text-white block tracking-tighter">{user.totalPoints}</span>
              <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mt-1">Points</span>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50 text-center">
              <span className="text-lg font-black text-white block tracking-tighter">{user.totalWins}</span>
              <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mt-1">Wins</span>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50 text-center">
              <span className="text-lg font-black text-white block tracking-tighter">{winRate}%</span>
              <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mt-1">Rate</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black text-sm rounded-[1.5rem] shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 uppercase tracking-widest"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};
