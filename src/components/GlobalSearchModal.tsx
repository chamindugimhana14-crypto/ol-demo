"use client";

import { useEffect, useState } from "react";
import { BookOpen, Calendar, CheckSquare, FileText, GraduationCap, Search, X } from "lucide-react";
import type { Chapter, HomeworkItem, Note, PdfResource, Subject, TodoItem, TuitionClass } from "@/db/schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  subjects: Subject[];
  chapters: Chapter[];
  tuitionClasses: TuitionClass[];
  homeworkItems: HomeworkItem[];
  notes: Note[];
  pdfResources: PdfResource[];
  todoItems: TodoItem[];
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectTab,
  subjects,
  chapters,
  tuitionClasses,
  homeworkItems,
  notes,
  pdfResources,
  todoItems,
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSubjects = q ? subjects.filter((s) => s.name.toLowerCase().includes(q) || s.teacher?.toLowerCase().includes(q)) : [];
  const filteredChapters = q ? chapters.filter((c) => c.title.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q)) : [];
  const filteredTuition = q ? tuitionClasses.filter((t) => t.teacherName.toLowerCase().includes(q) || t.institute.toLowerCase().includes(q)) : [];
  const filteredHomework = q ? homeworkItems.filter((h) => h.title.toLowerCase().includes(q) || h.notes.toLowerCase().includes(q)) : [];
  const filteredNotes = q ? notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.toLowerCase().includes(q)) : [];
  const filteredPdfs = q ? pdfResources.filter((p) => p.title.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)) : [];
  const filteredTodos = q ? todoItems.filter((t) => t.title.toLowerCase().includes(q)) : [];

  const totalResults =
    filteredSubjects.length +
    filteredChapters.length +
    filteredTuition.length +
    filteredHomework.length +
    filteredNotes.length +
    filteredPdfs.length +
    filteredTodos.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-16 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#FFD700]/30 bg-[#121212] shadow-2xl">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800 p-4">
          <Search className="h-5 w-5 text-[#FFD700]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, chapters, tuition, homework, past papers, notes..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Type anything to instantly search all 8 O/L subjects, notes, past papers & tuition classes.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              {/* Subjects */}
              {filteredSubjects.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                    Subjects ({filteredSubjects.length})
                  </p>
                  <div className="space-y-1">
                    {filteredSubjects.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectTab("subjects");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:border hover:border-[#FFD700]/50 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <span>{s.icon}</span> {s.name}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {s.teacher || "Tuition"} • {s.completedChapters}/{s.totalChapters} Ch.
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters */}
              {filteredChapters.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#00E5FF]">
                    Chapters & Lessons ({filteredChapters.length})
                  </p>
                  <div className="space-y-1">
                    {filteredChapters.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectTab("subjects");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-[#00E5FF]" /> {c.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">{c.status} ({c.progress}%)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Past Papers */}
              {filteredPdfs.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#E040FB]">
                    Past Papers & Marking Schemes ({filteredPdfs.length})
                  </p>
                  <div className="space-y-1">
                    {filteredPdfs.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectTab("pdf-library");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-[#E040FB]" /> {p.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">{p.year} • {p.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tuition Classes */}
              {filteredTuition.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#FF9100]">
                    Tuition Classes ({filteredTuition.length})
                  </p>
                  <div className="space-y-1">
                    {filteredTuition.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTab("tuition");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          <GraduationCap className="h-3.5 w-3.5 text-[#FF9100]" /> {t.teacherName}
                        </span>
                        <span className="text-[11px] text-zinc-400">{t.classDay} • {t.institute}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {filteredNotes.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#00E676]">
                    Study Notes ({filteredNotes.length})
                  </p>
                  <div className="space-y-1">
                    {filteredNotes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onSelectTab("notes");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-[#00E676]" /> {n.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">{n.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Homework & Tasks */}
              {(filteredHomework.length > 0 || filteredTodos.length > 0) && (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Homework & Tasks ({filteredHomework.length + filteredTodos.length})
                  </p>
                  <div className="space-y-1">
                    {filteredHomework.map((h) => (
                      <button
                        key={`h-${h.id}`}
                        onClick={() => {
                          onSelectTab("homework");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          <CheckSquare className="h-3.5 w-3.5 text-amber-400" /> [HW] {h.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">{h.priority}</span>
                      </button>
                    ))}
                    {filteredTodos.map((t) => (
                      <button
                        key={`t-${t.id}`}
                        onClick={() => {
                          onSelectTab("homework");
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-zinc-900/60 p-2.5 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                      >
                        <span className="flex items-center gap-2">
                          <CheckSquare className="h-3.5 w-3.5 text-amber-400" /> [Task] {t.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">{t.completed ? "Done" : "Pending"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/80 px-4 py-2 text-[11px] text-zinc-400">
          <span>Press <kbd className="rounded bg-zinc-800 px-1 py-0.5 text-white">ESC</kbd> to close</span>
          <span>Chamindu Gimhana&apos;s O/L AI Search</span>
        </div>
      </div>
    </div>
  );
}
