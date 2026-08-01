"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import {
  createTuitionClass,
  deleteTuitionClass,
  markTuitionAttendance,
  updateTuitionClass,
} from "@/app/actions";
import type { Subject, TuitionClass } from "@/db/schema";

interface Props {
  tuitionClasses: TuitionClass[];
  subjects: Subject[];
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TuitionTimetableGrid({ tuitionClasses, subjects }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("all");

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  // Calculate total monthly fee
  const totalMonthlyFee = tuitionClasses.reduce((sum, t) => sum + Number(t.monthlyFee || 0), 0);
  const totalAttendance = tuitionClasses.reduce((sum, t) => sum + (t.attendanceCount || 0), 0);

  const filtered = selectedDay === "all"
    ? tuitionClasses
    : tuitionClasses.filter((t) => t.classDay.toLowerCase().includes(selectedDay.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-5 lg:flex-row lg:items-center lg:justify-between shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#FFD700]" />
            Independent Tuition Classes & Timetable Hub
          </h2>
          <p className="text-xs text-zinc-400">
            Dedicated private candidate master schedule • Direct WhatsApp & attendance management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-1.5 text-xs text-zinc-300">
            Monthly Tuition Fee: <span className="font-bold text-[#FFD700]">LKR {totalMonthlyFee.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-2 text-xs font-bold text-black hover:bg-yellow-400"
          >
            <Plus className="h-4 w-4" /> Add Tuition Class
          </button>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
        <button
          onClick={() => setSelectedDay("all")}
          className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
            selectedDay === "all" ? "bg-[#FFD700] text-black font-bold" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          All Classes ({tuitionClasses.length})
        </button>
        {DAYS_OF_WEEK.map((day) => {
          const count = tuitionClasses.filter((t) => t.classDay.toLowerCase().includes(day.toLowerCase())).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                selectedDay === day
                  ? "bg-[#FFD700] text-black font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {day} ({count})
            </button>
          );
        })}
      </div>

      {/* Tuition Class Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const whatsappClean = (c.whatsapp || "").replace(/[^0-9]/g, "");
          const whatsappUrl = whatsappClean ? `https://wa.me/${whatsappClean}` : null;

          return (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#141414] p-5 shadow-xl transition-all hover:border-[#FFD700]/50"
            >
              <div>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/10 px-2.5 py-0.5 text-xs font-bold text-[#FFD700]">
                    {c.classDay}
                  </span>

                  <span
                    className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      c.mode === "online"
                        ? "bg-purple-950 text-purple-300 border border-purple-800/40"
                        : c.mode === "hybrid"
                        ? "bg-cyan-950 text-cyan-300 border border-cyan-800/40"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                    }`}
                  >
                    {c.mode === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                    {c.mode.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{c.teacherName}</h3>
                <p className="text-xs font-medium text-[#FFD700]">
                  {subjectMap.get(c.subjectId ?? -1) || "Tuition Subject"}
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">{c.institute}</p>

                {/* Details list */}
                <div className="mt-4 space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#FFD700]" />
                    <span>{c.classTime} ({c.durationMinutes} min)</span>
                  </div>

                  {c.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500 mt-0.5" />
                      <span className="text-zinc-400 line-clamp-1">{c.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[11px]">
                    <span className="text-zinc-400">Monthly Fee:</span>
                    <span className="font-bold text-[#FFD700]">LKR {Number(c.monthlyFee).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Attendance:</span>
                    <span className="font-mono text-emerald-400">{c.attendanceCount} classes</span>
                  </div>

                  {c.homework && (
                    <div className="rounded-lg bg-zinc-900/80 p-2 text-[11px] border border-zinc-800">
                      <p className="font-semibold text-amber-400">Class Homework:</p>
                      <p className="text-zinc-300">{c.homework}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 border-t border-zinc-800 pt-3">
                <div className="flex items-center gap-2">
                  <form action={markTuitionAttendance} className="flex-1">
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1 rounded-xl bg-emerald-600/90 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      <Users className="h-3.5 w-3.5" /> Attendance +1
                    </button>
                  </form>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center rounded-xl bg-emerald-700 p-2 text-white hover:bg-emerald-600"
                      title="Open Teacher's WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}

                  {c.contactNumber && (
                    <a
                      href={`tel:${c.contactNumber}`}
                      className="flex items-center justify-center rounded-xl bg-zinc-800 p-2 text-zinc-300 hover:text-white"
                      title="Call Teacher"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  )}

                  <form action={deleteTuitionClass}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-xl bg-zinc-900 p-2 text-zinc-500 hover:text-rose-400"
                      title="Delete Class"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Tuition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white">Add Tuition Class</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await createTuitionClass(formData);
                setShowAddModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Teacher Name</label>
                  <input
                    name="teacherName"
                    required
                    placeholder="e.g. Mr. Kapila Bandara"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Subject</label>
                  <select name="subjectId" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Tuition Institute</label>
                  <input
                    name="institute"
                    placeholder="e.g. Sasip / Sakya / Rotary"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Class Mode</label>
                  <select name="mode" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    <option value="physical">Physical</option>
                    <option value="online">Online (Zoom/Live)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-zinc-400">Class Day</label>
                  <select name="classDay" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400">Time</label>
                  <input
                    name="classTime"
                    placeholder="08:00 AM - 12:00 PM"
                    required
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Monthly Fee (LKR)</label>
                  <input
                    type="number"
                    name="monthlyFee"
                    defaultValue={3500}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">WhatsApp Number</label>
                  <input
                    name="whatsapp"
                    placeholder="+94 77 123 4567"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Contact Number</label>
                  <input
                    name="contactNumber"
                    placeholder="+94 77 123 4567"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400">Address / Hall details</label>
                <input
                  name="address"
                  placeholder="e.g. Hall A, Sasip Complex, Nugegoda"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400">Class Notes / Homework Requirements</label>
                <textarea
                  name="homework"
                  placeholder="Bring past paper book, log tables..."
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-4 py-2 font-bold text-black"
                >
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
