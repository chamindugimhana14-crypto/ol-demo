"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { AlertCircle, Calendar, Check, Dices, Flame, History, Plus, Sparkles } from "lucide-react";
import { createRevisionLog } from "@/app/actions";
import type { Chapter, RevisionLog, Subject } from "@/db/schema";
import { playChime } from "./SoundEffects";

interface Props {
  subjects: Subject[];
  chapters: Chapter[];
  revisionLogs: RevisionLog[];
}

export function SmartRevisionGenerator({ subjects, chapters, revisionLogs }: Props) {
  const [randomPick, setRandomPick] = useState<{ subject: string; topic: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // Pick a random topic from chapters or weak topics
  const pickRandomRevision = () => {
    setIsSpinning(true);
    playChime("tick");

    setTimeout(() => {
      setIsSpinning(false);
      const allCandidates: { subject: string; topic: string }[] = [];

      // Add chapters
      chapters.forEach((c) => {
        const sub = subjects.find((s) => s.id === c.subjectId);
        allCandidates.push({
          subject: sub?.name || "Subject",
          topic: c.title,
        });
      });

      // Add weak topics
      subjects.forEach((s) => {
        if (s.weakTopics) {
          s.weakTopics.split(",").forEach((w) => {
            if (w.trim()) {
              allCandidates.push({
                subject: s.name,
                topic: `[Weak Area] ${w.trim()}`,
              });
            }
          });
        }
      });

      if (allCandidates.length > 0) {
        const selected = allCandidates[Math.floor(Math.random() * allCandidates.length)];
        setRandomPick(selected);
        playChime("success");
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#FFD700", "#FFA500", "#FFFFFF"],
          });
        } catch (e) {
          console.debug(e);
        }
      }
    }, 600);
  };

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  // Heatmap generation (Last 12 weeks / 84 days)
  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      const logsOnDay = revisionLogs.filter((r) => {
        const rd = new Date(r.reviewedAt);
        return rd.toISOString().slice(0, 10) === dateStr;
      });

      const totalMins = logsOnDay.reduce((sum, r) => sum + r.minutes, 0);

      days.push({
        date: d,
        dateStr,
        count: logsOnDay.length,
        minutes: totalMins,
      });
    }

    return days;
  }, [revisionLogs]);

  const filteredLogs = useMemo(() => {
    if (filterType === "all") return revisionLogs;
    if (filterType === "weak") return revisionLogs.filter((r) => r.weakTopic);
    return revisionLogs.filter((r) => r.type === filterType);
  }, [revisionLogs, filterType]);

  return (
    <div className="space-y-6">
      {/* Header & Random Picker Banner */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Random Revision Picker */}
        <div className="relative overflow-hidden rounded-2xl border border-[#FFD700]/30 bg-gradient-to-br from-[#18150c] to-[#0d0d0d] p-5 shadow-xl lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFD700]/15 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD700] flex items-center gap-2">
              <Dices className="h-4 w-4" /> AI Random Revision Generator
            </h3>
            <span className="rounded-full bg-[#FFD700]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#FFD700]">
              Anti-Procrastination Wheel
            </span>
          </div>

          <div className="my-5 flex flex-col items-center justify-center text-center">
            {randomPick ? (
              <div className="animate-in zoom-in-95 space-y-2">
                <span className="rounded-md border border-[#FFD700]/40 bg-[#FFD700]/20 px-2.5 py-1 text-xs font-bold text-[#FFD700]">
                  {randomPick.subject}
                </span>
                <h2 className="text-xl font-bold text-white max-w-lg mt-2">{randomPick.topic}</h2>
                <p className="text-xs text-zinc-400">
                  Target: 25-minute deep focus session on this topic right now!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-300">
                  Not sure what to revise next?
                </p>
                <p className="text-xs text-zinc-500">
                  Let the smart algorithm pick a high-yield or weak topic from your syllabus.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={pickRandomRevision}
              disabled={isSpinning}
              className="flex items-center gap-2 rounded-xl bg-[#FFD700] px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 disabled:opacity-50"
            >
              <Dices className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
              {isSpinning ? "Selecting Topic..." : "Spin Random Topic"}
            </button>
          </div>
        </div>

        {/* Quick Log Form */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#FFD700] flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Quick Log Revision
          </h3>

          <form action={createRevisionLog} className="space-y-2.5 text-xs">
            <div>
              <select name="subjectId" required className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                name="topic"
                required
                placeholder="Topic / Chapter (e.g. Circle Theorems)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white placeholder-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select name="type" className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                <option value="daily">Daily Revision</option>
                <option value="weekly">Weekly Cycle</option>
                <option value="monthly">Monthly Master</option>
                <option value="weak-topic">Weak Topic</option>
                <option value="random">Random Session</option>
              </select>

              <input
                type="number"
                name="minutes"
                defaultValue={30}
                placeholder="Minutes"
                className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="weakTopic" name="weakTopic" className="rounded border-zinc-700" />
              <label htmlFor="weakTopic" className="text-zinc-300">Mark as Weak Topic</label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#FFD700] py-2 font-bold text-black hover:bg-yellow-400"
            >
              Log Revision Session
            </button>
          </form>
        </div>
      </div>

      {/* Revision Heatmap (84 Days) */}
      <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD700] flex items-center gap-2">
              <Flame className="h-4 w-4" /> 84-Day Revision & Focus Heatmap
            </h3>
            <p className="text-xs text-zinc-400">Daily visual consistency tracker</p>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <span>Less</span>
            <span className="h-3 w-3 rounded bg-zinc-800" />
            <span className="h-3 w-3 rounded bg-[#4d4011]" />
            <span className="h-3 w-3 rounded bg-[#997f1f]" />
            <span className="h-3 w-3 rounded bg-[#FFD700]" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2">
          {heatmapDays.map((day) => {
            const shade =
              day.count >= 4
                ? "bg-[#FFD700] border-[#FFD700]"
                : day.count >= 2
                ? "bg-[#997f1f] border-[#997f1f]"
                : day.count >= 1
                ? "bg-[#4d4011] border-[#4d4011]"
                : "bg-zinc-900 border-zinc-800/60";

            return (
              <div
                key={day.dateStr}
                title={`${day.dateStr}: ${day.count} revisions (${day.minutes} mins)`}
                className={`h-4 w-4 rounded-sm border ${shade} transition-all hover:scale-125`}
              />
            );
          })}
        </div>
      </div>

      {/* Revision Logs History & Filters */}
      <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD700] flex items-center gap-2">
            <History className="h-4 w-4" /> Revision Logs & Cycles ({filteredLogs.length})
          </h3>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: "all", label: "All Logs" },
              { id: "daily", label: "Daily" },
              { id: "weekly", label: "Weekly" },
              { id: "monthly", label: "Monthly" },
              { id: "weak", label: "Weak Topics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                  filterType === tab.id
                    ? "bg-[#FFD700] text-black font-semibold"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <p className="py-6 text-center text-xs text-zinc-500">No revision entries logged for this filter.</p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full p-1 ${
                      log.weakTopic ? "bg-rose-950 text-rose-400" : "bg-zinc-800 text-[#FFD700]"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">
                      {log.topic}
                      {log.weakTopic && (
                        <span className="ml-2 rounded bg-rose-950 px-1.5 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-800/50">
                          Weak Area
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {subjectMap.get(log.subjectId ?? -1) || "General"} • {log.type} cycle • {new Date(log.reviewedAt).toLocaleDateString("en-LK", { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-[#FFD700]">
                  {log.minutes} min
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
