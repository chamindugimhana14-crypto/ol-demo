"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Compass,
  Download,
  Dices,
  FileSpreadsheet,
  FileText,
  Flame,
  GraduationCap,
  HelpCircle,
  History,
  Layers,
  LayoutDashboard,
  Moon,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Target,
  Timer,
  Upload,
  User,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import {
  archiveSubject,
  createSubject,
  deleteSubject,
  resetToDefaultSeedData,
  restoreBackup,
  restoreSubject,
  saveBackup,
  updateSettings,
} from "@/app/actions";
import type {
  AppSetting,
  Chapter,
  HomeworkItem,
  MockExam,
  Note,
  PdfResource,
  RevisionLog,
  StudySession,
  Subject,
  TodoItem,
  TuitionClass,
} from "@/db/schema";
import { CountdownClock } from "./CountdownClock";
import { DailyStudyPlanner } from "./DailyStudyPlanner";
import { ExportReportsModal } from "./ExportReportsModal";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { HomeworkAndTasksModule } from "./HomeworkAndTasksModule";
import { MockExamsModule } from "./MockExamsModule";
import { NotesAndDocsModule } from "./NotesAndDocsModule";
import { PdfLibraryModule } from "./PdfViewerModal";
import { PomodoroTimer } from "./PomodoroTimer";
import { SmartRevisionGenerator } from "./SmartRevisionGenerator";
import { SubjectDetailDrawer } from "./SubjectDetailDrawer";
import { TuitionTimetableGrid } from "./TuitionTimetableGrid";

interface Props {
  subjects: Subject[];
  chapters: Chapter[];
  tuitionClasses: TuitionClass[];
  homeworkItems: HomeworkItem[];
  studySessions: StudySession[];
  revisionLogs: RevisionLog[];
  mockExams: MockExam[];
  notes: Note[];
  pdfResources: PdfResource[];
  todoItems: TodoItem[];
  settings: AppSetting | null;
  metrics: {
    plannedToday: number;
    actualToday: number;
    remainingToday: number;
    missedToday: number;
  };
}

export function MainStudyHub({
  subjects,
  chapters,
  tuitionClasses,
  homeworkItems,
  studySessions,
  revisionLogs,
  mockExams,
  notes,
  pdfResources,
  todoItems,
  settings,
  metrics,
}: Props) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedSubjectForDrawer, setSelectedSubjectForDrawer] = useState<Subject | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Subject filtering in Subjects Tab
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [subjectSort, setSubjectSort] = useState<string>("name");

  // Streak calculation
  const streak = useMemo(() => {
    const dates = new Set(
      revisionLogs
        .map((r) => new Date(r.reviewedAt))
        .filter((d) => !Number.isNaN(d.getTime()))
        .map((d) => d.toISOString().slice(0, 10))
    );

    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (dates.has(cursor.toISOString().slice(0, 10))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return Math.max(1, count);
  }, [revisionLogs]);

  // Overall syllabus completion
  const totalChapters = subjects.reduce((sum, s) => sum + s.totalChapters, 0);
  const completedChapters = subjects.reduce((sum, s) => sum + s.completedChapters, 0);
  const overallSyllabusPct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Mock Average
  const overallMockAvg =
    mockExams.length > 0
      ? (mockExams.reduce((sum, m) => sum + Number(m.percentage), 0) / mockExams.length).toFixed(1)
      : "0.0";

  // Filtered Subjects
  const displayedSubjects = useMemo(() => {
    let list = [...subjects];
    if (subjectFilter === "archived") {
      list = list.filter((s) => s.archived);
    } else if (subjectFilter === "active") {
      list = list.filter((s) => !s.archived);
    } else if (subjectFilter === "high") {
      list = list.filter((s) => s.priority === "high");
    }

    if (subjectSort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (subjectSort === "progress") {
      list.sort((a, b) => (b.completedChapters / (b.totalChapters || 1)) - (a.completedChapters / (a.totalChapters || 1)));
    } else if (subjectSort === "hours") {
      list.sort((a, b) => Number(b.actualStudyHours) - Number(a.actualStudyHours));
    }

    return list;
  }, [subjects, subjectFilter, subjectSort]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "subjects", label: "Subjects & Chapters", icon: BookOpen, badge: `${subjects.length}` },
    { id: "tuition", label: "Tuition Timetable", icon: GraduationCap, badge: `${tuitionClasses.length}` },
    { id: "planner", label: "Daily Study Planner", icon: Clock, badge: `${(metrics.actualToday / 60).toFixed(1)}h` },
    { id: "pomodoro", label: "Pomodoro Focus Pro", icon: Timer, badge: "Live" },
    { id: "homework", label: "Homework & Tasks", icon: CheckSquare, badge: `${homeworkItems.filter(h => h.status !== 'completed').length}` },
    { id: "revision", label: "Revision System", icon: History, badge: `${revisionLogs.length}` },
    { id: "mock-exams", label: "Mock Exams & 9A", icon: Target, badge: `${mockExams.length}` },
    { id: "pdf-library", label: "Past Papers & PDF", icon: FileText, badge: `${pdfResources.length}` },
    { id: "notes", label: "Notes & Theory", icon: Layers, badge: `${notes.length}` },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3, badge: null },
    { id: "settings", label: "Settings & Backup", icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 antialiased selection:bg-[#FFD700]/30 selection:text-white">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & User info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFD700]/40 bg-gradient-to-br from-amber-500 via-[#FFD700] to-yellow-600 text-black shadow-lg shadow-yellow-500/20">
              <span className="font-bold text-lg font-mono">CG</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white sm:text-base">Chamindu Gimhana</h1>
                <span className="rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-2 py-0.2 text-[10px] font-bold text-[#FFD700]">
                  Private Candidate
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                O/L 2026 AI Study Tracker Pro • Sri Lanka G.C.E O/L Dec 8-17, 2026
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Instant Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#141414] px-3 py-1.5 text-xs text-zinc-300 transition-all hover:border-[#FFD700] hover:text-white"
            >
              <Search className="h-4 w-4 text-[#FFD700]" />
              <span className="hidden sm:inline">Search (Cmd+K)</span>
            </button>

            {/* Quick Export Reports Button */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-1.5 text-xs font-bold text-[#FFD700] hover:bg-[#FFD700]/20"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden md:inline">Reports & Export</span>
            </button>
          </div>
        </div>

        {/* Tab Strip Navigation */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2 pt-1 sm:px-6 scrollbar-none">
          <nav className="flex space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "border border-[#FFD700] bg-[#FFD700] text-black shadow-md shadow-yellow-500/20"
                      : "border border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-[#141414] hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive ? "bg-black text-[#FFD700]" : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Live Countdown & Time Header */}
            <CountdownClock />

            {/* Core KPI Overview Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-4 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase tracking-wider">Overall Syllabus</span>
                  <BookOpen className="h-4 w-4 text-[#FFD700]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#FFD700]">{overallSyllabusPct}%</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full bg-[#FFD700]" style={{ width: `${overallSyllabusPct}%` }} />
                </div>
                <p className="mt-1.5 text-[10px] text-zinc-500">
                  {completedChapters} of {totalChapters} Chapters Completed
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-4 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase tracking-wider">Study Streak</span>
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
                <p className="mt-2 text-2xl font-bold text-orange-400">{streak} Days Active</p>
                <p className="mt-3 text-[10px] text-zinc-400">Consistent daily revision logged</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-4 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase tracking-wider">Mock Exam Average</span>
                  <Target className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="mt-2 text-2xl font-bold text-emerald-400">{overallMockAvg}%</p>
                <p className="mt-3 text-[10px] text-emerald-500">Targeting 9 Distinction (9A's)</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-4 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px] uppercase tracking-wider">Today&apos;s Focus Hours</span>
                  <Clock className="h-4 w-4 text-[#00E5FF]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#00E5FF]">
                  {(metrics.actualToday / 60).toFixed(1)} / {(metrics.plannedToday / 60).toFixed(1)} hrs
                </p>
                <p className="mt-3 text-[10px] text-zinc-500">
                  {metrics.remainingToday > 0
                    ? `${(metrics.remainingToday / 60).toFixed(1)}h remaining today`
                    : "Daily goal achieved!"}
                </p>
              </div>
            </div>

            {/* Motivational Quote Banner */}
            <div className="rounded-2xl border border-[#FFD700]/30 bg-gradient-to-r from-[#1b170c] via-[#141414] to-[#0c0c0c] p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD700] text-black">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    &ldquo;Success in G.C.E. O/L 2026 is built on daily disciplined focus sessions, repeated past paper drills, and relentless consistency.&rdquo;
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Chamindu Gimhana • Independent Study Master Plan
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Grid: 8 Subjects Cards Overview */}
            <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#FFD700]" />
                    8 O/L Examination Subjects Status
                  </h3>
                  <p className="text-xs text-zinc-400">Click any subject to open the chapter checklist</p>
                </div>
                <button
                  onClick={() => setActiveTab("subjects")}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-[#FFD700] hover:text-[#FFD700]"
                >
                  Manage All Subjects →
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {subjects.map((subject) => {
                  const pct =
                    subject.totalChapters > 0
                      ? Math.round((subject.completedChapters / subject.totalChapters) * 100)
                      : 0;

                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubjectForDrawer(subject)}
                      className="flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-[#161616] p-3.5 text-left transition-all hover:border-[#FFD700] hover:shadow-lg group"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{subject.icon}</span>
                          <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-[#FFD700]">
                            {pct}%
                          </span>
                        </div>
                        <h4 className="mt-2 font-bold text-white group-hover:text-[#FFD700] transition-colors">
                          {subject.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          {subject.teacher ? `${subject.teacher}` : "Self Study"}
                        </p>
                      </div>

                      <div className="mt-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: subject.color || "#FFD700",
                            }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-500">
                          {subject.completedChapters} / {subject.totalChapters} Ch. • {subject.actualStudyHours}h
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick 2-Column: Upcoming Tuition + Due Homework */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Tuition Alert */}
              <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#FFD700]" />
                    Upcoming Tuition Schedule
                  </h3>
                  <button
                    onClick={() => setActiveTab("tuition")}
                    className="text-xs text-[#FFD700] hover:underline"
                  >
                    View Timetable →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {tuitionClasses.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{c.teacherName}</p>
                        <p className="text-[11px] text-zinc-400">{c.classDay} • {c.classTime}</p>
                        <p className="text-[10px] text-zinc-500">{c.institute} ({c.mode})</p>
                      </div>
                      <span className="rounded-md border border-[#FFD700]/30 bg-[#FFD700]/10 px-2 py-1 text-[11px] font-bold text-[#FFD700]">
                        LKR {Number(c.monthlyFee).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Due Homework & Urgent Tasks */}
              <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-[#00E5FF]" />
                    Pending Homework & Goals
                  </h3>
                  <button
                    onClick={() => setActiveTab("homework")}
                    className="text-xs text-[#00E5FF] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {homeworkItems
                    .filter((h) => h.status !== "completed")
                    .slice(0, 4)
                    .map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{h.title}</p>
                          <p className="text-[11px] text-zinc-400">
                            Due: {h.dueDate ? new Date(h.dueDate).toLocaleDateString() : "Flexible"}
                          </p>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            h.priority === "high" ? "bg-rose-950 text-rose-300" : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {h.priority.toUpperCase()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBJECTS & CHAPTERS HUB */}
        {activeTab === "subjects" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-5 lg:flex-row lg:items-center lg:justify-between shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#FFD700]" />
                  Sri Lanka O/L 8-Subject Curriculum Mastery Hub
                </h2>
                <p className="text-xs text-zinc-400">
                  Full chapter breakdowns, revision counters, weak & strong topics
                </p>
              </div>

              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-2 text-xs font-bold text-black hover:bg-yellow-400"
              >
                <Plus className="h-4 w-4" /> Add Subject
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: "all", label: "All Subjects" },
                  { id: "active", label: "Active" },
                  { id: "high", label: "High Priority" },
                  { id: "archived", label: "Archived" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSubjectFilter(f.id)}
                    className={`rounded-xl px-3 py-1.5 font-medium transition-all ${
                      subjectFilter === f.id
                        ? "bg-[#FFD700] text-black font-bold"
                        : "bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Sort by:</span>
                <select
                  value={subjectSort}
                  onChange={(e) => setSubjectSort(e.target.value)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 p-1.5 text-white"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="progress">Completion %</option>
                  <option value="hours">Study Hours</option>
                </select>
              </div>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {displayedSubjects.map((s) => {
                const pct =
                  s.totalChapters > 0 ? Math.round((s.completedChapters / s.totalChapters) * 100) : 0;

                return (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#141414] p-5 shadow-xl transition-all hover:border-[#FFD700]/60 hover:shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-3xl">{s.icon}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            s.priority === "high" ? "bg-rose-950 text-rose-300" : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {s.priority.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold text-white text-base">{s.name}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{s.teacher || "Tuition Teacher"}</p>
                      <p className="text-[11px] text-zinc-500">{s.tuitionInstitute || "Institute"}</p>

                      <div className="mt-4 space-y-1.5 text-xs">
                        <div className="flex justify-between text-zinc-400">
                          <span>Chapters</span>
                          <span className="font-mono text-white">
                            {s.completedChapters} / {s.totalChapters}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: s.color || "#FFD700" }}
                          />
                        </div>

                        <div className="flex justify-between pt-1 text-[11px] text-zinc-400">
                          <span>Hours: {s.actualStudyHours}h</span>
                          <span className="font-bold text-[#FFD700]">{pct}% Done</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-zinc-800 pt-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSubjectForDrawer(s)}
                          className="flex-1 rounded-xl bg-zinc-800 py-1.5 text-xs font-bold text-zinc-200 hover:bg-[#FFD700] hover:text-black transition-colors"
                        >
                          View Chapters & Detail
                        </button>

                        {s.archived ? (
                          <form action={restoreSubject}>
                            <input type="hidden" name="id" value={s.id} />
                            <button
                              type="submit"
                              className="rounded-xl border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-zinc-800"
                            >
                              Restore
                            </button>
                          </form>
                        ) : (
                          <form action={archiveSubject}>
                            <input type="hidden" name="id" value={s.id} />
                            <button
                              type="submit"
                              className="rounded-xl border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800"
                              title="Archive Subject"
                            >
                              Archive
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TUITION TIMETABLE & FEES */}
        {activeTab === "tuition" && (
          <div className="animate-in fade-in duration-300">
            <TuitionTimetableGrid tuitionClasses={tuitionClasses} subjects={subjects} />
          </div>
        )}

        {/* TAB 4: DAILY STUDY PLANNER */}
        {activeTab === "planner" && (
          <div className="animate-in fade-in duration-300">
            <DailyStudyPlanner
              studySessions={studySessions}
              subjects={subjects}
              metrics={metrics}
            />
          </div>
        )}

        {/* TAB 5: POMODORO FOCUS PRO */}
        {activeTab === "pomodoro" && (
          <div className="mx-auto max-w-2xl animate-in fade-in duration-300">
            <PomodoroTimer subjects={subjects} />
          </div>
        )}

        {/* TAB 6: HOMEWORK & TASKS */}
        {activeTab === "homework" && (
          <div className="animate-in fade-in duration-300">
            <HomeworkAndTasksModule
              homeworkItems={homeworkItems}
              todoItems={todoItems}
              subjects={subjects}
            />
          </div>
        )}

        {/* TAB 7: REVISION SYSTEM */}
        {activeTab === "revision" && (
          <div className="animate-in fade-in duration-300">
            <SmartRevisionGenerator
              subjects={subjects}
              chapters={chapters}
              revisionLogs={revisionLogs}
            />
          </div>
        )}

        {/* TAB 8: MOCK EXAMS */}
        {activeTab === "mock-exams" && (
          <div className="animate-in fade-in duration-300">
            <MockExamsModule mockExams={mockExams} subjects={subjects} />
          </div>
        )}

        {/* TAB 9: PAST PAPERS & PDF LIBRARY */}
        {activeTab === "pdf-library" && (
          <div className="animate-in fade-in duration-300">
            <PdfLibraryModule pdfResources={pdfResources} subjects={subjects} />
          </div>
        )}

        {/* TAB 10: NOTES & THEORY */}
        {activeTab === "notes" && (
          <div className="animate-in fade-in duration-300">
            <NotesAndDocsModule notes={notes} subjects={subjects} />
          </div>
        )}

        {/* TAB 11: ANALYTICS & REPORTS */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-5 lg:flex-row lg:items-center lg:justify-between shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#FFD700]" />
                  Advanced Academic Analytics & Visual Comparison
                </h2>
                <p className="text-xs text-zinc-400">
                  Subject study distribution, completion percentages & mock grade predictions
                </p>
              </div>

              <button
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-4 py-2 text-xs font-bold text-black hover:bg-yellow-400"
              >
                <Printer className="h-4 w-4" /> Generate Printable PDF Report
              </button>
            </div>

            {/* Subject Study Hours & Progress Bars */}
            <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-sm">Subject Study Hours & Syllabus Progress</h3>

              <div className="space-y-4">
                {subjects.map((s) => {
                  const pct = s.totalChapters > 0 ? Math.round((s.completedChapters / s.totalChapters) * 100) : 0;
                  return (
                    <div key={s.id} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="flex items-center gap-2 text-white">
                          <span>{s.icon}</span> {s.name}
                        </span>
                        <span className="text-[#FFD700] font-mono">
                          {s.actualStudyHours}h actual / {s.estimatedStudyHours}h target ({pct}%)
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#FFD700] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: SETTINGS & OFFLINE BACKUP */}
        {activeTab === "settings" && (
          <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in duration-300">
            <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#FFD700]" />
                Application Settings & Preferences
              </h2>

              <form action={updateSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-semibold">Theme Mode</label>
                    <select
                      name="theme"
                      defaultValue={settings?.theme || "dark"}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                    >
                      <option value="dark">Black & Gold (Dark Matte)</option>
                      <option value="light">Light Luxury Mode</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-semibold">Accent Color</label>
                    <input
                      name="accentColor"
                      defaultValue={settings?.accentColor || "#FFD700"}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      name="notifications"
                      defaultChecked={settings?.notifications ?? true}
                      className="rounded border-zinc-700"
                    />
                    Enable Pomodoro Singing Bowl Audio & Sound Chimes
                  </label>

                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      name="autoSave"
                      defaultChecked={settings?.autoSave ?? true}
                      className="rounded border-zinc-700"
                    />
                    Auto Save all entries instantly to local database
                  </label>

                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      name="keyboardShortcuts"
                      defaultChecked={settings?.keyboardShortcuts ?? true}
                      className="rounded border-zinc-700"
                    />
                    Enable Keyboard Shortcuts (Cmd+K search, Spacebar timer)
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-4 py-2 font-bold text-black hover:bg-yellow-400"
                >
                  Save Application Preferences
                </button>
              </form>
            </div>

            {/* Local Backup & Restore */}
            <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Download className="h-4 w-4 text-[#FFD700]" />
                100% Offline Local Data Backup & Restore
              </h3>
              <p className="text-xs text-zinc-400">
                All data is stored locally in your database. You can save an offline JSON snapshot anytime or restore previous backups.
              </p>

              <div className="flex flex-wrap gap-3">
                <form action={saveBackup} className="flex-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 text-xs font-bold text-zinc-200 hover:border-[#FFD700] hover:text-[#FFD700]"
                  >
                    <Download className="h-4 w-4" /> Save Local Backup JSON
                  </button>
                </form>

                <form action={restoreBackup} className="flex-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 text-xs font-bold text-zinc-200 hover:border-emerald-500 hover:text-emerald-400"
                  >
                    <Upload className="h-4 w-4" /> Restore Last Saved Backup
                  </button>
                </form>
              </div>

              {/* Reset to Default Seed Data */}
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-400 mb-2">
                  Need to reload default 8 O/L subjects, sample timetable, and past papers?
                </p>
                <form action={resetToDefaultSeedData}>
                  <button
                    type="submit"
                    className="rounded-xl border border-rose-900/60 bg-rose-950/20 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-900/40"
                  >
                    Reset & Reload Sri Lanka O/L 2026 Sample Data
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Search Modal Popup */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        subjects={subjects}
        chapters={chapters}
        tuitionClasses={tuitionClasses}
        homeworkItems={homeworkItems}
        notes={notes}
        pdfResources={pdfResources}
        todoItems={todoItems}
      />

      {/* Subject Detail Drawer */}
      <SubjectDetailDrawer
        subject={selectedSubjectForDrawer}
        chapters={chapters}
        onClose={() => setSelectedSubjectForDrawer(null)}
      />

      {/* Export Reports & PDF Modal */}
      <ExportReportsModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        subjects={subjects}
        studySessions={studySessions}
        mockExams={mockExams}
        revisionLogs={revisionLogs}
        tuitionClasses={tuitionClasses}
        homeworkItems={homeworkItems}
      />

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <h3 className="font-bold text-white mb-4">Add New Examination Subject</h3>

            <form
              action={async (formData) => {
                await createSubject(formData);
                setShowAddSubjectModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Subject Name</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Mathematics"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Icon (Emoji)</label>
                  <input
                    name="icon"
                    defaultValue="📘"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Teacher</label>
                  <input
                    name="teacher"
                    placeholder="Teacher Name"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Tuition Institute</label>
                  <input
                    name="tuitionInstitute"
                    placeholder="Institute"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-zinc-400">Priority</label>
                  <select name="priority" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400">Total Chapters</label>
                  <input
                    type="number"
                    name="totalChapters"
                    defaultValue={12}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400">Est. Study Hours</label>
                  <input
                    type="number"
                    name="estimatedStudyHours"
                    defaultValue={50}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-4 py-2 font-bold text-black hover:bg-yellow-400"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
