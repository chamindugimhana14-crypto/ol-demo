"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Calendar, Clock, Flame, Sparkles } from "lucide-react";

const EXAM_START = new Date("2026-12-08T08:30:00+05:30");
const EXAM_END = new Date("2026-12-17T17:00:00+05:30");

function diffParts(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export function CountdownClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    return diffParts(EXAM_START, now);
  }, [now]);

  // Total preparation timeline calculation (Assume 2-year preparation baseline from Jan 1 2025 to Dec 8 2026)
  const prepStart = new Date("2025-01-01T00:00:00+05:30");
  const totalPrepMs = EXAM_START.getTime() - prepStart.getTime();
  const elapsedMs = now ? Math.max(0, now.getTime() - prepStart.getTime()) : 0;
  const prepPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalPrepMs) * 100)));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Main Live Countdown */}
      <div className="relative overflow-hidden rounded-2xl border border-[#FFD700]/30 bg-gradient-to-br from-[#18150c] via-[#121212] to-[#0a0a0a] p-5 shadow-2xl md:col-span-2">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#FFD700]/5 blur-3xl" />
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFD700]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 animate-ping rounded-full bg-[#FFD700]" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
              Sri Lanka G.C.E. O/L 2026 Live Countdown
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#FFD700]">
            <Award className="h-3 w-3" /> Dec 8 – Dec 17, 2026
          </span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center sm:gap-3">
          {[
            { label: "Days", val: parts.days, sub: "Remaining" },
            { label: "Hours", val: parts.hours, sub: "In Day" },
            { label: "Minutes", val: parts.minutes, sub: "In Hour" },
            { label: "Seconds", val: parts.seconds, sub: "Live Pulse" },
          ].map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-xl border border-[#FFD700]/20 bg-[#171717]/90 p-2.5 transition-all hover:border-[#FFD700]/60 sm:p-3"
            >
              <div className="text-2xl font-bold tracking-tight text-[#FFD700] sm:text-3xl lg:text-4xl tabular-nums">
                {String(item.val).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
                {item.label}
              </div>
              <div className="hidden text-[9px] text-zinc-500 sm:block">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Preparation Timeline bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#FFD700]" /> Preparation Timeline Elapsed
            </span>
            <span className="font-semibold text-[#FFD700]">{prepPercent}% Elapsed</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-[#FFD700] to-yellow-300 transition-all duration-500"
              style={{ width: `${prepPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sri Lanka Time & Exam Status */}
      <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#121212]/90 p-5 shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-[#FFD700]" /> Colombo Time (LK)
            </span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300">UTC +05:30</span>
          </div>

          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl tabular-nums">
              {now
                ? now.toLocaleTimeString("en-LK", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "--:--:--"}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="h-3 w-3 text-[#FFD700]" />
              {now
                ? now.toLocaleDateString("en-LK", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Loading date..."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/5 p-3 text-xs">
          <p className="flex items-center gap-1 font-semibold text-[#FFD700]">
            <Flame className="h-3.5 w-3.5" /> Target: 9 A Distinction (9A's)
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-300">
            Private Candidate Strategy • Daily Focus Hours Goal: 6.5 Hours
          </p>
        </div>
      </div>
    </div>
  );
}
