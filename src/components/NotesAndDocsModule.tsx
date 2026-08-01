"use client";

import { useState } from "react";
import {
  Bookmark,
  Edit,
  FileText,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { createNote, deleteNote, toggleBookmarkNote, updateNote } from "@/app/actions";
import type { Note, Subject } from "@/db/schema";

interface Props {
  notes: Note[];
  subjects: Subject[];
}

export function NotesAndDocsModule({ notes, subjects }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const filtered = notes.filter((n) => {
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (selectedSubject !== "all" && String(n.subjectId) !== selectedSubject) return false;
    if (
      search &&
      !n.title.toLowerCase().includes(search.toLowerCase()) &&
      !n.content.toLowerCase().includes(search.toLowerCase()) &&
      !n.tags.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const categories = Array.from(new Set(notes.map((n) => n.category || "General")));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FFD700]" />
            Study Notes, Formulae & Theory Vault
          </h2>
          <p className="text-xs text-zinc-400">
            Rich markdown summaries, formulae sheets & grammar rules for all 8 subjects
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-2 text-xs font-bold text-black hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4" /> Create Study Note
        </button>
      </div>

      {/* Filters Row */}
      <div className="grid gap-3 rounded-2xl border border-zinc-800/80 bg-black/40 p-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, tags, concepts..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#141414] p-5 shadow-xl transition-all hover:border-[#FFD700]/50"
          >
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="rounded-md border border-[#FFD700]/30 bg-[#FFD700]/10 px-2 py-0.5 text-[10px] font-bold text-[#FFD700]">
                  {subjectMap.get(note.subjectId ?? -1) || "General"}
                </span>

                <div className="flex items-center gap-1">
                  <form action={toggleBookmarkNote}>
                    <input type="hidden" name="id" value={note.id} />
                    <input type="hidden" name="current" value={note.bookmarked ? "true" : "false"} />
                    <button type="submit" className="rounded p-1 text-zinc-400 hover:text-[#FFD700]">
                      <Bookmark className={`h-4 w-4 ${note.bookmarked ? "fill-[#FFD700] text-[#FFD700]" : ""}`} />
                    </button>
                  </form>

                  <button
                    onClick={() => setEditingNote(note)}
                    className="rounded p-1 text-zinc-400 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <form action={deleteNote}>
                    <input type="hidden" name="id" value={note.id} />
                    <button type="submit" className="rounded p-1 text-zinc-500 hover:text-rose-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              <h3 className="font-bold text-white text-sm">{note.title}</h3>
              <p className="text-[11px] text-zinc-400">{note.category}</p>

              {/* Note Content preview */}
              <div className="my-3 max-h-40 overflow-y-auto rounded-xl bg-black/40 p-3 font-mono text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap border border-zinc-800/80">
                {note.content}
              </div>

              {note.tags && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.split(",").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-zinc-800/80 pt-2 text-[10px] text-zinc-500">
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Note Modal */}
      {(showAddModal || editingNote) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white">
                {editingNote ? "Edit Study Note" : "Create Study Note"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingNote(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                if (editingNote) {
                  await updateNote(formData);
                } else {
                  await createNote(formData);
                }
                setShowAddModal(false);
                setEditingNote(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              {editingNote && <input type="hidden" name="id" value={editingNote.id} />}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Note Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingNote?.title || ""}
                    placeholder="e.g. Circle Theorems Cheat Sheet"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Subject</label>
                  <select
                    name="subjectId"
                    defaultValue={editingNote?.subjectId || ""}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  >
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
                  <label className="text-zinc-400">Category</label>
                  <input
                    name="category"
                    defaultValue={editingNote?.category || "Theory Summary"}
                    placeholder="e.g. Formula Sheet, Grammar, Code"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Tags (comma separated)</label>
                  <input
                    name="tags"
                    defaultValue={editingNote?.tags || ""}
                    placeholder="Maths, Geometry, High-Yield"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400">Note Content (Markdown / Text)</label>
                <textarea
                  name="content"
                  required
                  defaultValue={editingNote?.content || ""}
                  placeholder="Type your summary, rules, or formulas here..."
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white font-mono text-xs"
                  rows={8}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNote(null);
                  }}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-4 py-2 font-bold text-black"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
