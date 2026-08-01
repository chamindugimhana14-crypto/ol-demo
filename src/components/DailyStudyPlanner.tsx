"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Moon,
  Plus,
  RotateCw,
  Sun,
  Sunrise,
  Sunset,
  Trash2,
} from "lucide-react";
import {
  carryForwardMissedSessions,
  completeStudySession,
  createStudySession,
  deleteStudySession,
} from "@/app/actions";
import type { StudySession, Subject } from "@/db/schema";

interface Props {
  studySessions: StudySession[];
  subjects: Subject[];
  metrics: {
    plannedToday: number;
    actualToday: number;
    remainingToday: number;
    missedToday: number;
  };
}

const SLOTS = [
  { id: "morning", label: "Morning Session", time: "05:00 AM - 08:00 AM", icon: Sunrise, color: "text-amber-400" },
  { id: "afternoon", label: "Afternoon Session", time: "02:00 PM - 05:00 PM", icon: Sun, color: "text-yellow-400" },
  { id: "evening", label: "Evening Session", time: "05:30 PM - 08:30 PM", icon: Sunset, color: "text-orange-400" },
  { id: "night", label: "Night Deep Session", time: "09:00 PM - 11:30 PM", icon: Moon, color: "text-purple-400" },
];

export function DailyStudyPlanner({ studySessions, subjects, metrics }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"slots" | "timeline">("slots");

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const plannedHours = (metrics.plannedToday / 60).toFixed(1);
  const actualHours = (metrics.actualToday / 60).toFixed(1);
  const remainingHours = (metrics.remainingToday / 60).toFixed(1);
  const completionPct = metrics.plannedToday > 0 ? Math.min(100, Math.round((metrics.actualToday / metrics.plannedToday) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner with Hours Calculation & Carry Forward */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-gradient-to-r from-[#18150c] to-[#0f0f0f] p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FFD700]" />
            Daily 4-Slot Study Planner & Execution Matrix
          </h2>
          <p className="text-xs text-zinc-400">
            Morning (05:00), Afternoon (14:00), Evening (17:30), Night (21:00) sessions
          </p>
        </div>

        <form action={carryForwardMissedSessions}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-4 py-2 text-xs font-bold text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
          >
            <RotateCw className="h-4 w-4" /> Carry Unfinished Tasks to Tomorrow
          </button>
        </form>
      </div>

      {/* Daily Progress Gauge & Hours summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Daily Target Planned</p>
          <p className="mt-1 text-2xl font-bold text-white">{plannedHours} Hours</p>
          <p className="text-[10px] text-zinc-500">{metrics.plannedToday} planned minutes</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Actual Completed Today</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{actualHours} Hours</p>
          <p className="text-[10px] text-zinc-500">{completionPct}% of planned target</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Remaining Today</p>
          <p className="mt-1 text-2xl font-bold text-[#FFD700]">{remainingHours} Hours</p>
          <p className="text-[10px] text-zinc-500">Keep the streak alive!</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Daily Execution Rate</p>
          <p className="mt-1 text-2xl font-bold text-[#00E5FF]">{completionPct}%</p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full bg-[#00E5FF]" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* 4 Core Study Slots Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {SLOTS.map((slot) => {
          const SlotIcon = slot.icon;
          const slotSessions = studySessions.filter((s) => s.slot === slot.id);

          return (
            <div
              key={slot.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl"
            >
              <div>
                <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <SlotIcon className={`h-5 w-5 ${slot.color}`} />
                    <div>
                      <h3 className="font-bold text-white text-sm">{slot.label}</h3>
                      <p className="text-[11px] text-zinc-400 font-mono">{slot.time}</p>
                    </div>
                  </div>
                  <span className="rounded-md border border-zinc-800 bg-black/40 px-2 py-0.5 text-xs text-zinc-400">
                    {slotSessions.length} Tasks
                  </span>
                </div>

                {/* Session list */}
                <div className="space-y-2.5">
                  {slotSessions.length === 0 ? (
                    <p className="py-4 text-center text-xs text-zinc-500">
                      No study task scheduled for {slot.label.toLowerCase()}.
                    </p>
                  ) : (
                    slotSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`rounded-xl border p-3 text-xs transition-all ${
                          session.completed
                            ? "border-emerald-950/80 bg-emerald-950/20"
                            : session.carriedForward
                            ? "border-amber-950/80 bg-amber-950/20"
                            : "border-zinc-800 bg-zinc-900/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white flex items-center gap-1.5">
                              {session.completed && <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
                              {session.title}
                            </p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              {subjectMap.get(session.subjectId ?? -1) || "Self Study"} • Planned: {session.plannedMinutes}m
                              {session.actualMinutes > 0 ? ` • Done: ${session.actualMinutes}m` : ""}
                            </p>
                            {session.notes && <p className="text-[11px] text-zinc-500 mt-1">{session.notes}</p>}
                          </div>

                          <form action={deleteStudySession}>
                            <input type="hidden" name="id" value={session.id} />
                            <button
                              type="submit"
                              className="rounded p-1 text-zinc-500 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>

                        {!session.completed && (
                          <form
                            action={completeStudySession}
                            className="mt-3 flex items-center gap-2 border-t border-zinc-800/60 pt-2"
                          >
                            <input type="hidden" name="id" value={session.id} />
                            <input
                              type="number"
                              name="actualMinutes"
                              defaultValue={session.plannedMinutes}
                              placeholder="Actual min"
                              className="w-24 rounded-lg border border-zinc-700 bg-black/50 px-2 py-1 text-xs text-white"
                            />
                            <button
                              type="submit"
                              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                            >
                              Mark Session Completed
                            </button>
                          </form>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Add To Slot Form */}
              <form
                action={createStudySession}
                className="mt-4 flex flex-wrap gap-2 border-t border-zinc-800 pt-3 text-xs"
              >
                <input type="hidden" name="slot" value={slot.id} />
                <select name="subjectId" className="rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 text-white">
                  <option value="">Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  name="title"
                  required
                  placeholder="Task title..."
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 text-white placeholder-zinc-500"
                />
                <input
                  type="number"
                  name="plannedMinutes"
                  defaultValue={60}
                  className="w-16 rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#FFD700] px-3 py-1.5 font-bold text-black hover:bg-yellow-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
