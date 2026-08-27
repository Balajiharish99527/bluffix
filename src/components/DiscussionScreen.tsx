"use client";

import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { ActiveGame, PlayerState } from "@/lib/roomManager";
import { Language, translations } from "@/lib/i18n";
import { sounds } from "@/lib/audio";
import { AvatarIcon } from "@/components/AvatarIcon";
import { API_BASE } from "@/lib/apiConfig";

interface DiscussionScreenProps {
  activeGame: ActiveGame;
  players: PlayerState[];
  currentUserId: string;
  lang: Language;
  roomCode: string;
}

export const DiscussionScreen: React.FC<DiscussionScreenProps> = ({
  activeGame,
  players,
  currentUserId,
  lang,
  roomCode,
}) => {
  const t = translations[lang];
  const [timeLeft, setTimeLeft] = useState(60);
  const [suspectNotes, setSuspectNotes] = useState<Record<string, string>>({});
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isRecording, setIsAiRecording] = useState(false);

  const isImpostor = activeGame.playerRoles[currentUserId] === "impostor";

  useEffect(() => {
    // We now primarily use the server-side aiAnomalyName
    if (!activeGame.aiAnomalyName && !aiAnalysis && activeGame.clues.length >= 3) {
      const timer = setTimeout(() => {
        const sorted = [...activeGame.clues].sort((a, b) => a.text.length - b.text.length);
        if (sorted[0]) setAiAnalysis(sorted[0].userId);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeGame.clues, activeGame.aiAnomalyName, aiAnalysis]);

  // AI VOICE BROADCAST LOGIC
  const startVoiceBroadcast = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Neural voice link not supported in this terminal (browser).");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      sounds.playClick();
      setIsAiRecording(true);
    };

    recognition.onresult = async (event: any) => {
      const result = event.results[0][0].transcript;
      try {
        await fetch(`${API_BASE}/api/rooms/secure-signal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: roomCode, userId: currentUserId, text: result })
        });
      } catch (e) {}
    };

    recognition.onend = () => setIsAiRecording(false);
    recognition.start();
  };

  useEffect(() => {
    sounds.playAmbient("discussion");
  }, []);

  useEffect(() => {
    if (!activeGame.timerExpiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((activeGame.timerExpiresAt! - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 5 && remaining > 0) {
        sounds.playTick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGame.timerExpiresAt]);

  const toggleSuspectNote = (userId: string, tag: string) => {
    sounds.playClick();
    setSuspectNotes((prev) => ({
      ...prev,
      [userId]: prev[userId] === tag ? "" : tag,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Discussion Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-10 -mt-10"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Icons.MessageSquare className="w-5 h-5 animate-bounce" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">{t.discussionPhase}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Analyze The Clues<span className="text-indigo-500 not-italic">.</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t.discussWhoIsImpostor}</p>
          </div>

          <div className={`px-6 py-4 rounded-3xl border transition-colors flex flex-col items-center ${
            timeLeft <= 5 ? "bg-rose-500/10 border-rose-500/30" : "bg-zinc-950/50 border-zinc-800"
          }`}>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Time to Vote</span>
            <div className={`text-2xl font-black font-mono ${timeLeft <= 5 ? "text-rose-500" : "text-white"}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Clues Recap Grid with Interactive Suspicion Tags */}
      <div className="space-y-3">
        {players.map((p) => {
          const pClue = activeGame.clues.find((c) => c.userId === p.userId);
          const note = suspectNotes[p.userId] || "";

          return (
            <div
              key={p.userId}
              className={`group p-5 rounded-[2rem] border transition-all duration-300 flex items-center justify-between gap-4 ${
                note === "SUS"
                  ? "bg-rose-500/5 border-rose-500/30 shadow-xl shadow-rose-500/5"
                  : note === "SAFE"
                  ? "bg-emerald-500/5 border-emerald-500/30 shadow-xl shadow-emerald-500/5"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center space-x-5 flex-1 min-w-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                  note === "SUS" ? "bg-rose-500 text-white" : note === "SAFE" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700"
                }`}>
                  <AvatarIcon name={p.avatar} className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">{p.name}</span>
                    {note === "SUS" && <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Suspected</span>}
                  </div>
                  <span className={`text-base font-black tracking-tight italic uppercase truncate block ${
                    pClue ? "text-white" : "text-zinc-700"
                  }`}>
                    {pClue ? `"${pClue.text}"` : "NO DATA"}
                  </span>
                </div>
              </div>

              {/* Suspicion Quick Toggles */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSuspectNote(p.userId, "SUS")}
                  className={`p-3 rounded-2xl border transition-all ${
                    note === "SUS"
                      ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/20"
                      : "bg-zinc-950/50 text-zinc-600 border-zinc-800 hover:text-rose-400 hover:border-rose-500/30"
                  }`}
                >
                  <Icons.Search className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSuspectNote(p.userId, "SAFE")}
                  className={`p-3 rounded-2xl border transition-all ${
                    note === "SAFE"
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20"
                      : "bg-zinc-950/50 text-zinc-600 border-zinc-800 hover:text-emerald-400 hover:border-emerald-500/30"
                  }`}
                >
                  <Icons.ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[2rem] text-center flex flex-col items-center space-y-3">
        {(activeGame.aiAnomalyName || aiAnalysis) ? (
          <div className="flex flex-col items-center space-y-1 animate-in fade-in duration-700">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Icons.BrainCircuit className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Link Analysis</span>
            </div>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
              Anomaly detected in data stream: <span className="text-white italic underline decoration-indigo-500/50">{activeGame.aiAnomalyName || players.find(p => p.userId === aiAnalysis)?.name}</span>
            </p>
          </div>
        ) : (
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
            Processing transmission patterns for anomalies...
          </p>
        )}
      </div>

      {/* AI SECURE VOICE CHANNEL */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icons.Radio className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Secure Comm-Link</span>
          </div>
          {!isImpostor && (
            <button
              onClick={startVoiceBroadcast}
              disabled={isRecording}
              className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                isRecording ? "bg-rose-600 animate-pulse text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              {isRecording ? "Broadcasting..." : "Start Secure Broadcast"}
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
          {activeGame.secureCommStream.length === 0 ? (
            <p className="text-[9px] text-zinc-700 font-black uppercase text-center py-4 italic">No secure signals detected</p>
          ) : (
            activeGame.secureCommStream.map((msg, i) => (
              <div key={i} className="flex flex-col space-y-1 animate-in slide-in-from-left-2 duration-300">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{msg.name}</span>
                <p className="text-[10px] font-black text-white italic">
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
