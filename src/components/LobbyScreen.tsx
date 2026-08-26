"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";
import { RoomState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";

interface LobbyScreenProps {
  room: RoomState;
  currentUserId: string;
  lang: Language;
  onReady: () => void;
  onStart: () => void;
  onKick: (targetUserId: string) => void;
  onTransferHost: (newHostId: string) => void;
  onLeave: () => void;
  onOpenSettings: () => void;
  onAddBot: () => void; // Added
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  currentUserId,
  lang,
  onReady,
  onStart,
  onKick,
  onTransferHost,
  onLeave,
  onOpenSettings,
  onAddBot, // Added
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const me = room.players.find((p) => p.userId === currentUserId);
  const isHost = me?.isHost || false;

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Room Identity Card */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Room Session Live</span>
            </div>
            <div className="flex items-center space-x-4">
              <h2 className="text-5xl font-black tracking-tighter text-white font-mono">
                {room.code}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl text-zinc-300 transition-all flex items-center justify-center group/copy relative"
                >
                  {copied ? <Icons.Check className="w-5 h-5 text-emerald-400" /> : <Icons.Copy className="w-5 h-5" />}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[8px] font-black py-1 px-2 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Copy Key</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    const url = `${window.location.origin}?join=${room.code}`;
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-2xl text-zinc-300 transition-all flex items-center justify-center group/link relative"
                >
                  <Icons.Share2 className="w-5 h-5" />
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[8px] font-black py-1 px-2 rounded opacity-0 group-hover/link:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Copy Link</span>
                </button>
                {isHost && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenSettings();
                    }}
                    className="p-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl text-indigo-400 transition-all"
                  >
                    <Icons.Settings className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="text-indigo-400 mr-2">Mode</span> {room.settings.gameMode}
            </div>
            <div className="px-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="text-amber-400 mr-2">Cat</span> {room.settings.categoryId}
            </div>
            {room.settings.isAiMode && (
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <Icons.Brain className="w-3 h-3 animate-pulse" />
                <span>AI Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
            Players <span className="text-white ml-2">{room.players.length} / {room.settings.maxPlayers}</span>
          </h3>
          <button
            onClick={() => { sounds.playClick(); onLeave(); }}
            className="flex items-center space-x-2 text-[10px] font-black text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest"
          >
            <Icons.LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>

        {isHost && room.players.length < room.settings.maxPlayers && (
          <button
            onClick={() => { sounds.playClick(); onAddBot(); }}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 transition-all mb-4"
          >
            + Deploy AI Bot Operative
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {room.players.map((p) => (
            <div
              key={p.userId}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 p-4 flex items-center justify-between ${
                p.userId === currentUserId
                  ? "bg-zinc-900 border-indigo-500/50 shadow-xl shadow-indigo-500/5"
                  : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  p.userId === currentUserId ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400"
                }`}>
                  <AvatarIcon name={p.avatar} className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm text-white tracking-tight">{p.name}</span>
                    {p.isHost && <Icons.Crown className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{p.score} pts</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {p.isReady ? (
                  <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">
                    Ready
                  </div>
                ) : (
                  <div className="bg-zinc-800 text-zinc-500 border border-zinc-700/50 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">
                    Waiting
                  </div>
                )}

                {isHost && p.userId !== currentUserId && (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onKick(p.userId)}
                      className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Icons.UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => { sounds.playClick(); onReady(); }}
          className={`flex-1 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] border ${
            me?.isReady
              ? "bg-zinc-900 border-zinc-800 text-zinc-400"
              : "bg-white text-black border-transparent shadow-2xl"
          }`}
        >
          {me?.isReady ? "Cancel Ready" : "Set Ready Status"}
        </button>

        {isHost && (
          <button
            onClick={() => { sounds.playClick(); onStart(); }}
            disabled={room.players.length < 3}
            className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl shadow-indigo-600/20 transition-all transform active:scale-[0.98]"
          >
            Launch Game
          </button>
        )}
      </div>

      {room.players.length < 3 && (
        <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-amber-500/80 uppercase tracking-widest animate-pulse">
          <Icons.Clock className="w-4 h-4" />
          <span>Minimum 3 players required to launch session</span>
        </div>
      )}
    </div>
  );
};
