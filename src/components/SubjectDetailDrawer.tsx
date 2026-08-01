"use client";

import { useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit,
  GraduationCap,
  Plus,
  RotateCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  createChapter,
  deleteChapter,
  incrementChapterRevision,
  updateChapter,
  updateSubject,
} from "@/app/actions";
import type { Chapter, Subject } from "@/db/schema";

interface Props {
  subject: Subject | null;
  chapters: Chapter[];
  onClose: () => void;
}

export function SubjectDetailDrawer({ subject, chapters, onClose }: Props) {
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);

  if (!subject) return null;

  const subjectChapters = chapters.filter((c) => c.subjectId === subject.id);
  const completedCount = subjectChapters.filter((c) => c.status === "completed" || c.progress === 100).length;
  const totalCount = Math.max(subject.totalChapters, subjectChapters.length);
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {subject.name}
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: subject.color || "#FFD700" }}
                />
              </h2>
              <p className="text-xs text-zinc-400">
                {subject.teacher ? `${subject.teacher} • ` : ""}
                {subject.tuitionInstitute || "Tuition Class"} • Priority: {subject.priority}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingSubject(!isEditingSubject)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:border-[#FFD700] hover:text-[#FFD700]"
              title="Edit Subject Info"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Edit Subject Form */}
        {isEditingSubject && (
          <form
            action={async (formData) => {
              await updateSubject(formData);
              setIsEditingSubject(false);
            }}
            className="my-4 rounded-xl border border-[#FFD700]/30 bg-black/50 p-4 text-xs space-y-3"
          >
            <input type="hidden" name="id" value={subject.id} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400">Subject Name</label>
                <input
                  name="name"
                  defaultValue={subject.name}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400">Teacher</label>
                <input
                  name="teacher"
                  defaultValue={subject.teacher || ""}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400">Tuition Institute</label>
                <input
                  name="tuitionInstitute"
                  defaultValue={subject.tuitionInstitute || ""}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400">Priority</label>
                <select
                  name="priority"
                  defaultValue={subject.priority}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400">Estimated Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  name="estimatedStudyHours"
                  defaultValue={subject.estimatedStudyHours}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400">Actual Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  name="actualStudyHours"
                  defaultValue={subject.actualStudyHours}
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400">Weak Topics to master</label>
              <textarea
                name="weakTopics"
                defaultValue={subject.weakTopics}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                rows={2}
              />
            </div>

            <div>
              <label className="text-zinc-400">Strong Topics</label>
              <textarea
                name="strongTopics"
                defaultValue={subject.strongTopics}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingSubject(false)}
                className="rounded bg-zinc-800 px-3 py-1 text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#FFD700] px-4 py-1 font-semibold text-black"
              >
                Save Subject Details
              </button>
            </div>
          </form>
        )}

        {/* Progress & Metrics KPI Cards */}
        <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
            <p className="text-[10px] uppercase text-zinc-400">Completion</p>
            <p className="text-lg font-bold text-[#FFD700]">{completionPct}%</p>
            <p className="text-[10px] text-zinc-500">
              {completedCount} / {totalCount} Chapters
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
            <p className="text-[10px] uppercase text-zinc-400">Study Hours</p>
            <p className="text-lg font-bold text-white">{Number(subject.actualStudyHours).toFixed(1)}h</p>
            <p className="text-[10px] text-zinc-500">Target {subject.estimatedStudyHours}h</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
            <p className="text-[10px] uppercase text-zinc-400">Revision Count</p>
            <p className="text-lg font-bold text-[#00E5FF]">{subject.revisionCount}</p>
            <p className="text-[10px] text-zinc-500">Cycles logged</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
            <p className="text-[10px] uppercase text-zinc-400">Mock Avg</p>
            <p className="text-lg font-bold text-emerald-400">{Number(subject.mockExamAverage).toFixed(1)}%</p>
            <p className="text-[10px] text-zinc-500">Predicted: A Grade</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-1 flex justify-between text-xs text-zinc-400">
            <span>Syllabus Coverage</span>
            <span className="font-semibold text-[#FFD700]">{completionPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#FFD700]"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Weak & Strong Topics Cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-3">
            <p className="flex items-center gap-1.5 font-bold text-rose-400">
              <AlertCircle className="h-4 w-4" /> Weak Topics (Target Revision)
            </p>
            <p className="mt-1 text-zinc-300">{subject.weakTopics || "No weak topics identified yet."}</p>
          </div>
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3">
            <p className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Sparkles className="h-4 w-4" /> Strong Topics (Mastered)
            </p>
            <p className="mt-1 text-zinc-300">{subject.strongTopics || "Core topics in progress."}</p>
          </div>
        </div>

        {/* Chapters Checklist & Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#FFD700]" />
              Chapters & Lessons ({subjectChapters.length})
            </h3>
            <button
              onClick={() => setShowAddChapter(!showAddChapter)}
              className="flex items-center gap-1 rounded-lg bg-[#FFD700] px-2.5 py-1 text-xs font-semibold text-black hover:bg-yellow-400"
            >
              <Plus className="h-3.5 w-3.5" /> Add Chapter
            </button>
          </div>

          {/* Add Chapter Form */}
          {showAddChapter && (
            <form
              action={async (formData) => {
                await createChapter(formData);
                setShowAddChapter(false);
              }}
              className="rounded-xl border border-zinc-700 bg-black/60 p-3 text-xs space-y-2"
            >
              <input type="hidden" name="subjectId" value={subject.id} />
              <input
                name="title"
                required
                placeholder="Chapter / Lesson Title (e.g. Quadratic Equations)"
                className="w-full rounded border border-zinc-700 bg-zinc-900 p-2 text-white"
              />
              <div className="grid grid-cols-3 gap-2">
                <select name="difficulty" className="rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select name="priority" className="rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white">
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <input
                  type="number"
                  name="estimatedMinutes"
                  placeholder="Est. min (e.g. 180)"
                  defaultValue={180}
                  className="rounded border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="rounded bg-zinc-800 px-3 py-1 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#FFD700] px-3 py-1 font-semibold text-black"
                >
                  Add Chapter
                </button>
              </div>
            </form>
          )}

          {/* Chapter Items */}
          <div className="space-y-2">
            {subjectChapters.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-500">
                No chapters added yet for {subject.name}. Click &ldquo;Add Chapter&rdquo; to add your syllabus topics.
              </p>
            ) : (
              subjectChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3 text-xs transition-all hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5">
                        {chapter.status === "completed" || chapter.progress === 100 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : chapter.status === "in-progress" ? (
                          <RotateCw className="h-4 w-4 text-[#FFD700]" />
                        ) : (
                          <Clock className="h-4 w-4 text-zinc-500" />
                        )}
                      </span>
                      <div>
                        <p className="font-semibold text-zinc-200">{chapter.title}</p>
                        <p className="text-[11px] text-zinc-400">
                          {chapter.difficulty} difficulty • Priority: {chapter.priority} • {chapter.estimatedMinutes}m est.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <form action={incrementChapterRevision}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300 hover:border-[#FFD700] hover:text-[#FFD700]"
                          title="Log revision for this chapter"
                        >
                          🔄 Rev: {chapter.revisionCounter}
                        </button>
                      </form>

                      <form action={deleteChapter}>
                        <input type="hidden" name="id" value={chapter.id} />
                        <button
                          type="submit"
                          className="rounded p-1 text-zinc-500 hover:text-rose-400"
                          title="Delete Chapter"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-zinc-800/50 pt-2">
                    <form action={updateChapter} className="flex flex-wrap items-center gap-1.5">
                      <input type="hidden" name="id" value={chapter.id} />
                      <button
                        type="submit"
                        name="status"
                        value="pending"
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                          chapter.status === "pending"
                            ? "bg-zinc-700 text-white"
                            : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="in-progress"
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                          chapter.status === "in-progress"
                            ? "bg-[#FFD700] text-black font-semibold"
                            : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        type="submit"
                        name="status"
                        value="completed"
                        className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                          chapter.status === "completed"
                            ? "bg-emerald-600 text-white font-semibold"
                            : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        ✓ Completed
                      </button>
                    </form>

                    <span className="text-[11px] font-medium text-zinc-400">
                      {chapter.progress}% Progress
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
