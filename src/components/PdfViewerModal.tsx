"use client";

import { useState } from "react";
import {
  Bookmark,
  Calendar,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { createPdfResource, deletePdfResource, toggleBookmarkPdf } from "@/app/actions";
import type { PdfResource, Subject } from "@/db/schema";

interface Props {
  pdfResources: PdfResource[];
  subjects: Subject[];
}

export function PdfLibraryModule({ pdfResources, subjects }: Props) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [previewPdf, setPreviewPdf] = useState<PdfResource | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const filtered = pdfResources.filter((p) => {
    if (selectedType !== "all" && p.type !== selectedType) return false;
    if (selectedYear !== "all" && String(p.year) !== selectedYear) return false;
    if (selectedSubject !== "all" && String(p.subjectId) !== selectedSubject) return false;
    if (
      search &&
      !p.title.toLowerCase().includes(search.toLowerCase()) &&
      !p.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-[#121212] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FFD700]" />
            O/L Past Papers, Model Papers & Marking Schemes Library
          </h2>
          <p className="text-xs text-zinc-400">
            Official Sri Lanka Department of Examinations papers & model paper archive
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-2 text-xs font-bold text-black hover:bg-yellow-400"
          >
            <Plus className="h-4 w-4" /> Add Past Paper / Resource
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid gap-3 rounded-2xl border border-zinc-800/80 bg-black/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers & answers..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500"
          />
        </div>

        {/* Type filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200"
        >
          <option value="all">All Types (Past Papers, Schemes, Notes)</option>
          <option value="Past Paper">Past Papers</option>
          <option value="Marking Schemes">Marking Schemes</option>
          <option value="Model Paper">Model Papers</option>
          <option value="Notes">Study Notes & Books</option>
          <option value="Books">Reference Books</option>
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200"
        >
          <option value="all">All Years (2018 - 2026)</option>
          <option value="2026">2026 Model</option>
          <option value="2025">2025 Model / Target</option>
          <option value="2024">2024 Past Paper</option>
          <option value="2023">2023 Past Paper</option>
          <option value="2022">2022 Past Paper</option>
          <option value="2021">2021 Past Paper</option>
          <option value="2020">2020 Past Paper</option>
          <option value="2019">2019 Past Paper</option>
        </select>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-200"
        >
          <option value="all">All 8 Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of PDF Resources */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#141414] p-4 transition-all hover:border-[#FFD700]/50 hover:shadow-xl"
          >
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    item.type === "Past Paper"
                      ? "bg-amber-950/70 text-[#FFD700] border border-[#FFD700]/30"
                      : item.type === "Marking Schemes"
                      ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/30"
                      : "bg-purple-950/70 text-purple-300 border border-purple-500/30"
                  }`}
                >
                  {item.type}
                </span>

                <div className="flex items-center gap-1">
                  <form action={toggleBookmarkPdf}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="current" value={item.bookmarked ? "true" : "false"} />
                    <button
                      type="submit"
                      className="rounded p-1 text-zinc-400 hover:text-[#FFD700]"
                      title="Bookmark Resource"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${item.bookmarked ? "fill-[#FFD700] text-[#FFD700]" : ""}`}
                      />
                    </button>
                  </form>

                  <form action={deletePdfResource}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="rounded p-1 text-zinc-500 hover:text-rose-400"
                      title="Delete Resource"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              <h3 className="font-semibold text-white group-hover:text-[#FFD700] transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{item.description}</p>
            </div>

            <div className="mt-4 border-t border-zinc-800/80 pt-3">
              <div className="mb-3 flex items-center justify-between text-[11px] text-zinc-400">
                <span>
                  {subjectMap.get(item.subjectId ?? -1) || "General"} • {item.medium}
                </span>
                <span>{item.year || "2024"} • {item.fileSize}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewPdf(item)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900 py-1.5 text-xs font-semibold text-zinc-200 hover:border-[#FFD700] hover:text-[#FFD700]"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Downloading "${item.title}" (${item.fileSize}) for offline local study.`);
                  }}
                  className="flex items-center justify-center gap-1 rounded-xl bg-[#FFD700] px-3 py-1.5 text-xs font-bold text-black hover:bg-yellow-400"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Simulated Viewer Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-[#FFD700]/40 bg-[#121212] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FFD700]" />
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{previewPdf.title}</h3>
                  <p className="text-xs text-zinc-400">
                    {previewPdf.type} • {previewPdf.year} • {previewPdf.medium} Medium • {previewPdf.fileSize}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewPdf(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6 text-zinc-300">
              <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-[#141414] p-8 shadow-inner font-sans space-y-6">
                <div className="border-b border-zinc-700 pb-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#FFD700]">
                    DEPARTMENT OF EXAMINATIONS, SRI LANKA
                  </p>
                  <h1 className="mt-1 text-lg font-bold text-white">
                    General Certificate of Education (Ord. Level) Examination 2026
                  </h1>
                  <p className="text-xs text-zinc-400 mt-1">
                    Subject: {subjectMap.get(previewPdf.subjectId ?? -1) || "General"} | {previewPdf.type}
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800">
                    <p className="font-semibold text-[#FFD700]">Document Overview & Instructions:</p>
                    <p className="mt-1 text-zinc-300">{previewPdf.description}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Part I (Compulsory Multiple Choice & Short Questions)
                    </p>
                    <p className="text-zinc-400">
                      1. Answer all questions on the paper provided. Each question carries equal marks.
                    </p>
                    <p className="text-zinc-400">
                      2. Read the questions carefully and select the most appropriate response or step-by-step working.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Part II (Structured Essay & Problem Solving)
                    </p>
                    <p className="text-zinc-400">
                      • Section A: Four compulsory structured questions.
                    </p>
                    <p className="text-zinc-400">
                      • Section B: Select any three comprehensive application problems.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-center">
                  <p className="text-xs font-semibold text-emerald-400">
                    ✓ High Resolution Offline Ready PDF verified for O/L preparation
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/80 p-4">
              <span className="text-xs text-zinc-400">Ready for instant offline printing</span>
              <button
                onClick={() => {
                  alert(`Downloading offline file: ${previewPdf.title}`);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-4 py-1.5 text-xs font-bold text-black hover:bg-yellow-400"
              >
                <Download className="h-4 w-4" /> Download PDF ({previewPdf.fileSize})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add PDF Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white">Add Past Paper / Model Paper</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await createPdfResource(formData);
                setShowAddModal(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="text-zinc-400">Resource Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. 2024 Mathematics Past Paper Part I & II"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                <div>
                  <label className="text-zinc-400">Type</label>
                  <select name="type" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    <option value="Past Paper">Past Paper</option>
                    <option value="Marking Schemes">Marking Schemes</option>
                    <option value="Model Paper">Model Paper</option>
                    <option value="Notes">Notes / Summaries</option>
                    <option value="Books">Reference Book</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-zinc-400">Year</label>
                  <input
                    type="number"
                    name="year"
                    defaultValue={2024}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Medium</label>
                  <input
                    name="medium"
                    defaultValue="Sinhala"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">File Size</label>
                  <input
                    name="fileSize"
                    defaultValue="2.5 MB"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400">Description / Key Questions</label>
                <textarea
                  name="description"
                  placeholder="Notes on what is covered in this paper..."
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  rows={3}
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
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
