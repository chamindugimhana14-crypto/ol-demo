"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  FileSpreadsheet,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { createMockExam, deleteMockExam } from "@/app/actions";
import type { MockExam, Subject } from "@/db/schema";

interface Props {
  mockExams: MockExam[];
  subjects: Subject[];
}

export function MockExamsModule({ mockExams, subjects }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("all");

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const filtered = selectedSubject === "all"
    ? mockExams
    : mockExams.filter((m) => String(m.subjectId) === selectedSubject);

  const averagePct = mockExams.length > 0
    ? (mockExams.reduce((sum, m) => sum + Number(m.percentage), 0) / mockExams.length).toFixed(1)
    : "0.0";

  const totalA = mockExams.filter((m) => m.grade === "A").length;
  const totalB = mockExams.filter((m) => m.grade === "B").length;
  const totalC = mockExams.filter((m) => m.grade === "C").length;

  return (
    <div className="space-y-6">
      {/* Top Banner with KPIs */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-[#FFD700]" />
            Mock Exams & 9A Grade Predictor Analytics
          </h2>
          <p className="text-xs text-zinc-400">
            Sri Lanka G.C.E. O/L Grading: A (≥75) • B (≥65) • C (≥50) • S (≥35) • W (&lt;35)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-2 text-xs font-bold text-black hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4" /> Log Mock Exam Result
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Mock Exam Average</p>
          <p className="mt-1 text-3xl font-bold text-[#FFD700]">{averagePct}%</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">Distinction Standard</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Grade 'A' Count</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">{totalA}</p>
          <p className="text-[10px] text-zinc-500">Exams scored ≥ 75%</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Total Mocks Attempted</p>
          <p className="mt-1 text-3xl font-bold text-white">{mockExams.length}</p>
          <p className="text-[10px] text-zinc-500">Past & Model papers timed</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-4">
          <p className="text-[11px] uppercase text-zinc-400">Predicted O/L 2026 Outcome</p>
          <p className="mt-1 text-2xl font-bold text-[#00E5FF]">9A Distinction</p>
          <p className="text-[10px] text-zinc-400">Island Rank Contender</p>
        </div>
      </div>

      {/* Filter by Subject */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-800/80 bg-black/40 p-3">
        <button
          onClick={() => setSelectedSubject("all")}
          className={`rounded-xl px-3 py-1.5 text-xs font-medium ${
            selectedSubject === "all" ? "bg-[#FFD700] text-black font-bold" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          All Subjects ({mockExams.length})
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(String(s.id))}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium ${
              selectedSubject === String(s.id) ? "bg-[#FFD700] text-black font-bold" : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Exam Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mock) => (
          <div
            key={mock.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#141414] p-5 shadow-xl transition-all hover:border-[#FFD700]/50"
          >
            <div>
              <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-[#FFD700]">
                  {subjectMap.get(mock.subjectId ?? -1) || "Subject Mock"}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    mock.grade === "A"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                      : mock.grade === "B"
                      ? "bg-amber-950 text-amber-400 border border-amber-500/40"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  Grade {mock.grade} ({mock.percentage}%)
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{mock.marks}</span>
                <span className="text-xs text-zinc-400">/ 100 marks</span>
                <span className="ml-auto text-xs text-zinc-400 font-mono">
                  ⏱️ {mock.timeTakenMinutes} min
                </span>
              </div>

              <p className="mt-1 text-[11px] text-zinc-500">
                Exam Date: {new Date(mock.examDate).toLocaleDateString("en-LK", { dateStyle: "long" })}
              </p>

              {/* Mistakes & Weak Areas */}
              <div className="mt-4 space-y-2 text-xs">
                {mock.mistakes && (
                  <div className="rounded-xl border border-rose-950/60 bg-rose-950/20 p-2.5 text-rose-300">
                    <p className="font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> Mistake Journal:
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-300">{mock.mistakes}</p>
                  </div>
                )}

                {mock.weakAreas && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2.5">
                    <p className="font-bold text-amber-400 text-[11px]">Weak Area:</p>
                    <p className="text-[11px] text-zinc-300">{mock.weakAreas}</p>
                  </div>
                )}

                {mock.improvementNotes && (
                  <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/20 p-2.5 text-emerald-300">
                    <p className="font-bold text-[11px]">Action for Next Mock:</p>
                    <p className="text-[11px] text-zinc-300">{mock.improvementNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end border-t border-zinc-800 pt-2">
              <form action={deleteMockExam}>
                <input type="hidden" name="id" value={mock.id} />
                <button type="submit" className="rounded p-1 text-zinc-500 hover:text-rose-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Add Mock Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white">Log Mock Exam / Term Test</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await createMockExam(formData);
                setShowAddModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Subject</label>
                  <select name="subjectId" required className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400">Exam Date</label>
                  <input
                    type="date"
                    name="examDate"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-zinc-400">Marks Scored</label>
                  <input
                    type="number"
                    step="0.5"
                    name="marks"
                    required
                    placeholder="85"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Total Marks</label>
                  <input
                    type="number"
                    name="total"
                    defaultValue={100}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Time (Minutes)</label>
                  <input
                    type="number"
                    name="timeTakenMinutes"
                    defaultValue={180}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400">Mistakes & Lost Marks</label>
                <textarea
                  name="mistakes"
                  placeholder="Which questions lost marks and why?"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-zinc-400">Weak Areas to Revise</label>
                <input
                  name="weakAreas"
                  placeholder="e.g. Geometry Circle proofs, Organic chemistry equations"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400">Improvement Plan for Next Exam</label>
                <textarea
                  name="improvementNotes"
                  placeholder="Actionable steps to score 90+ next time"
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
                  Save Mock Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
