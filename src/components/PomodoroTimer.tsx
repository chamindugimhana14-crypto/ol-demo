"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  Bell,
  Coffee,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { playChime } from "./SoundEffects";

type FocusStore = {
  sessions: number;
  totalMinutes: number;
  dailyMinutes: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
  dayKey: string;
  weekKey: string;
  monthKey: string;
};

const PRESETS = [
  { label: "25m Sprint", min: 25 },
  { label: "45m Standard", min: 45 },
  { label: "60m Deep Work", min: 60 },
  { label: "90m Exam Drill", min: 90 },
];

const BREAKS = [
  { label: "5m Short Break", min: 5 },
  { label: "10m Tea Break", min: 10 },
  { label: "15m Long Rest", min: 15 },
];

function getKeys(date = new Date()) {
  const dayKey = date.toISOString().slice(0, 10);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const monthKey = `${year}-${month}`;

  const firstJan = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - firstJan.getTime()) / 86400000) + 1;
  const week = Math.ceil(dayOfYear / 7);
  const weekKey = `${year}-W${String(week).padStart(2, "0")}`;

  return { dayKey, weekKey, monthKey };
}

function loadStore(): FocusStore {
  const keys = getKeys();
  if (typeof window === "undefined") {
    return {
      sessions: 0,
      totalMinutes: 0,
      dailyMinutes: 0,
      weeklyMinutes: 0,
      monthlyMinutes: 0,
      ...keys,
    };
  }

  const raw = window.localStorage.getItem("chamindu-focus-store");
  if (!raw) {
    return {
      sessions: 0,
      totalMinutes: 0,
      dailyMinutes: 0,
      weeklyMinutes: 0,
      monthlyMinutes: 0,
      ...keys,
    };
  }

  try {
    const parsed = JSON.parse(raw) as FocusStore;
    return {
      ...parsed,
      dailyMinutes: parsed.dayKey === keys.dayKey ? parsed.dailyMinutes : 0,
      weeklyMinutes: parsed.weekKey === keys.weekKey ? parsed.weeklyMinutes : 0,
      monthlyMinutes: parsed.monthKey === keys.monthKey ? parsed.monthlyMinutes : 0,
      dayKey: keys.dayKey,
      weekKey: keys.weekKey,
      monthKey: keys.monthKey,
    };
  } catch {
    return {
      sessions: 0,
      totalMinutes: 0,
      dailyMinutes: 0,
      weeklyMinutes: 0,
      monthlyMinutes: 0,
      ...keys,
    };
  }
}

export function PomodoroTimer({ subjects = [] }: { subjects?: { id: number; name: string }[] }) {
  const [store, setStore] = useState<FocusStore>(() => loadStore());
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [customMinutes, setCustomMinutes] = useState(50);
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("chamindu-focus-store", JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setIsRunning(false);

          if (soundEnabled) {
            playChime("success");
          }

          if (!isBreak) {
            // Confetti celebration
            try {
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#FFD700", "#FFFFFF", "#FFA500"],
              });
            } catch (e) {
              console.debug(e);
            }

            const finishedMinutes = targetMinutes;
            setStore((current) => ({
              ...current,
              sessions: current.sessions + 1,
              totalMinutes: current.totalMinutes + finishedMinutes,
              dailyMinutes: current.dailyMinutes + finishedMinutes,
              weeklyMinutes: current.weeklyMinutes + finishedMinutes,
              monthlyMinutes: current.monthlyMinutes + finishedMinutes,
            }));
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, isBreak, targetMinutes, soundEnabled]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((targetMinutes * 60 - secondsLeft) / (targetMinutes * 60 || 1)) * 100))
  );

  const dailyHours = useMemo(() => (store.dailyMinutes / 60).toFixed(1), [store.dailyMinutes]);
  const weeklyHours = useMemo(() => (store.weeklyMinutes / 60).toFixed(1), [store.weeklyMinutes]);
  const monthlyHours = useMemo(() => (store.monthlyMinutes / 60).toFixed(1), [store.monthlyMinutes]);

  const startTimer = () => {
    if (soundEnabled) playChime("bell");
    setIsRunning(true);
  };

  const pauseTimer = () => {
    if (soundEnabled) playChime("tick");
    setIsRunning(false);
  };

  const resetTimer = (min: number, breakMode = false) => {
    setIsRunning(false);
    setIsBreak(breakMode);
    setTargetMinutes(min);
    setSecondsLeft(min * 60);
  };

  return (
    <div
      className={`rounded-2xl border border-[#FFD700]/30 bg-gradient-to-b from-[#161616] to-[#0c0c0c] p-5 shadow-2xl transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col justify-center bg-black/95 p-8"
          : "relative"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-[#FFD700]" />
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD700]">
            Pomodoro Focus Pro (Black & Gold)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-300 hover:border-[#FFD700] hover:text-[#FFD700]"
            title={soundEnabled ? "Mute Bell Sound" : "Enable Bell Sound"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-zinc-500" />}
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-300 hover:border-[#FFD700] hover:text-[#FFD700]"
            title="Toggle Fullscreen Focus"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <span className="rounded-md border border-[#FFD700]/30 bg-[#FFD700]/10 px-2 py-0.5 text-xs font-medium text-[#FFD700]">
            {store.sessions} Completed
          </span>
        </div>
      </div>

      {/* Target Subject selector */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs text-zinc-400">Focusing on:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-[#1f1f1f] px-2.5 py-1 text-xs text-zinc-200"
        >
          {subjects.length > 0 ? (
            subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))
          ) : (
            <>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="History">History</option>
              <option value="Commerce">Commerce</option>
              <option value="ICT">ICT</option>
              <option value="Drama">Drama</option>
            </>
          )}
        </select>
      </div>

      {/* Big Circular / Digits Display */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-zinc-800/80 bg-gradient-to-b from-[#141414] to-[#0a0a0a] shadow-inner sm:h-56 sm:w-56">
          {/* Progress ring visual */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              fill="transparent"
              stroke="#FFD700"
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              className="transition-all duration-500"
            />
          </svg>

          <div className="text-center z-10">
            <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl tabular-nums drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
              {mm}:{ss}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs font-medium text-zinc-400">
              {isBreak ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Coffee className="h-3 w-3" /> Break Mode
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#FFD700]">
                  <Sparkles className="h-3 w-3" /> Deep Focus • {selectedSubject}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Presets & Controls */}
      <div className="space-y-3">
        {/* Preset Focus Buttons */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {PRESETS.map((p) => (
            <button
              key={p.min}
              type="button"
              onClick={() => resetTimer(p.min, false)}
              className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-all ${
                targetMinutes === p.min && !isBreak
                  ? "border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]"
                  : "border-zinc-800 bg-[#1a1a1a] text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Break buttons */}
        <div className="flex flex-wrap gap-1.5">
          {BREAKS.map((b) => (
            <button
              key={b.min}
              type="button"
              onClick={() => resetTimer(b.min, true)}
              className={`flex-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-all ${
                targetMinutes === b.min && isBreak
                  ? "border-emerald-500 bg-emerald-900/30 text-emerald-300"
                  : "border-zinc-800 bg-[#161616] text-zinc-400 hover:border-zinc-700"
              }`}
            >
              ☕ {b.label}
            </button>
          ))}
        </div>

        {/* Custom Timer Input & Main Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-black/40 px-2 py-1">
            <span className="text-xs text-zinc-400">Custom:</span>
            <input
              type="number"
              min={1}
              max={180}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value) || 25)}
              className="w-12 bg-transparent text-center text-xs font-bold text-[#FFD700]"
            />
            <button
              type="button"
              onClick={() => resetTimer(customMinutes, false)}
              className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-700"
            >
              Set
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {!isRunning ? (
              <button
                type="button"
                onClick={startTimer}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#FFD700] to-yellow-400 px-5 py-2 text-xs font-bold text-black shadow-lg shadow-yellow-500/20 hover:brightness-110"
              >
                <Play className="h-4 w-4 fill-current" /> Start Session
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseTimer}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-black shadow-lg hover:brightness-110"
              >
                <Pause className="h-4 w-4 fill-current" /> Pause
              </button>
            )}

            <button
              type="button"
              onClick={() => resetTimer(targetMinutes, isBreak)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:border-zinc-700 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Focus Hours Statistics Cards */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3 text-center">
        <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-2">
          <p className="text-[10px] uppercase text-zinc-400">Today</p>
          <p className="text-sm font-bold text-[#FFD700]">{dailyHours} hrs</p>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-2">
          <p className="text-[10px] uppercase text-zinc-400">This Week</p>
          <p className="text-sm font-bold text-[#FFD700]">{weeklyHours} hrs</p>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-2">
          <p className="text-[10px] uppercase text-zinc-400">This Month</p>
          <p className="text-sm font-bold text-[#FFD700]">{monthlyHours} hrs</p>
        </div>
      </div>
    </div>
  );
}
