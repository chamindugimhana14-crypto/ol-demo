"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Printer, Sparkles, X } from "lucide-react";
import type { HomeworkItem, MockExam, RevisionLog, StudySession, Subject, TuitionClass } from "@/db/schema";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  studySessions: StudySession[];
  mockExams: MockExam[];
  revisionLogs: RevisionLog[];
  tuitionClasses: TuitionClass[];
  homeworkItems: HomeworkItem[];
}

export function ExportReportsModal({
  isOpen,
  onClose,
  subjects,
  studySessions,
  mockExams,
  revisionLogs,
  tuitionClasses,
  homeworkItems,
}: Props) {
  const [reportType, setReportType] = useState<"summary" | "mocks" | "tuition" | "revision">("summary");

  if (!isOpen) return null;

  const totalActualHours = subjects.reduce((sum, s) => sum + Number(s.actualStudyHours), 0);
  const totalTargetHours = subjects.reduce((sum, s) => sum + Number(s.estimatedStudyHours), 0);
  const overallMockAvg =
    mockExams.length > 0
      ? (mockExams.reduce((sum, m) => sum + Number(m.percentage), 0) / mockExams.length).toFixed(1)
      : "0.0";

  // CSV Exporter
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "summary") {
      csvContent += "Subject,Teacher,Total Chapters,Completed Chapters,Completion %,Actual Study Hours,Mock Exam Avg %\n";
      subjects.forEach((s) => {
        const pct = s.totalChapters > 0 ? Math.round((s.completedChapters / s.totalChapters) * 100) : 0;
        csvContent += `"${s.name}","${s.teacher || ""}","${s.totalChapters}","${s.completedChapters}","${pct}%","${s.actualStudyHours}","${s.mockExamAverage}%"\n`;
      });
    } else if (reportType === "mocks") {
      csvContent += "Subject ID,Date,Marks,Percentage,Grade,Time Taken (Min),Weak Areas,Improvement Notes\n";
      mockExams.forEach((m) => {
        csvContent += `"${m.subjectId}","${new Date(m.examDate).toLocaleDateString()}","${m.marks}","${m.percentage}%","${m.grade}","${m.timeTakenMinutes}","${m.weakAreas}","${m.improvementNotes}"\n`;
      });
    } else if (reportType === "tuition") {
      csvContent += "Teacher Name,Institute,Day,Time,Duration (Min),Monthly Fee (LKR),Attendance Count\n";
      tuitionClasses.forEach((t) => {
        csvContent += `"${t.teacherName}","${t.institute}","${t.classDay}","${t.classTime}","${t.durationMinutes}","${t.monthlyFee}","${t.attendanceCount}"\n`;
      });
    } else if (reportType === "revision") {
      csvContent += "Date,Topic,Type,Minutes,Weak Topic\n";
      revisionLogs.forEach((r) => {
        csvContent += `"${new Date(r.reviewedAt).toLocaleDateString()}","${r.topic}","${r.type}","${r.minutes}","${r.weakTopic}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Chamindu_OL_2026_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-[#FFD700]/40 bg-[#121212] shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FFD700]" />
            <div>
              <h3 className="font-bold text-white text-base">O/L 2026 Academic Reports & Data Export</h3>
              <p className="text-xs text-zinc-400">Owner: Chamindu Gimhana • Sri Lanka G.C.E O/L 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800 bg-zinc-900/50 p-3">
          {[
            { id: "summary", label: "Executive Summary" },
            { id: "mocks", label: "Mock Exam Analytics" },
            { id: "tuition", label: "Tuition Timetable & Fees" },
            { id: "revision", label: "Revision Activity Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as typeof reportType)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                reportType === tab.id
                  ? "bg-[#FFD700] text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-[#FFD700] hover:text-[#FFD700]"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export CSV (Excel)
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-1.5 text-xs font-bold text-black hover:bg-yellow-400"
            >
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Printable Report Preview Body */}
        <div id="printable-report" className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6 text-zinc-200">
          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-[#141414] p-8 shadow-inner space-y-6">
            {/* Header Document */}
            <div className="border-b border-[#FFD700]/30 pb-4 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#FFD700]">
                CHAMINDU GIMHANA • O/L AI STUDY TRACKER PRO
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">
                Official Sri Lanka G.C.E. O/L 2026 Academic Progress Report
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Generated on {new Date().toLocaleDateString("en-LK", { dateStyle: "full" })}
              </p>
            </div>

            {/* Quick KPI summary */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-zinc-400">Subjects</p>
                <p className="text-lg font-bold text-[#FFD700]">{subjects.length}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-zinc-400">Total Study Hours</p>
                <p className="text-lg font-bold text-white">{totalActualHours.toFixed(1)}h</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-zinc-400">Mock Exam Avg</p>
                <p className="text-lg font-bold text-emerald-400">{overallMockAvg}%</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="text-zinc-400">Predicted Result</p>
                <p className="text-lg font-bold text-[#00E5FF]">9 Distinctions (9A)</p>
              </div>
            </div>

            {/* Report Table */}
            {reportType === "summary" && (
              <div>
                <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
                  Subject Mastery Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="border-b border-zinc-700 bg-zinc-900/80 text-[11px] uppercase text-zinc-400">
                      <tr>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Teacher & Institute</th>
                        <th className="p-2.5">Chapters</th>
                        <th className="p-2.5">Progress</th>
                        <th className="p-2.5">Study Hours</th>
                        <th className="p-2.5">Mock Avg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {subjects.map((s) => {
                        const pct = s.totalChapters > 0 ? Math.round((s.completedChapters / s.totalChapters) * 100) : 0;
                        return (
                          <tr key={s.id} className="hover:bg-zinc-900/40">
                            <td className="p-2.5 font-semibold text-white flex items-center gap-1.5">
                              <span>{s.icon}</span> {s.name}
                            </td>
                            <td className="p-2.5 text-zinc-400">{s.teacher || "-"} • {s.tuitionInstitute || "-"}</td>
                            <td className="p-2.5 font-mono">{s.completedChapters} / {s.totalChapters}</td>
                            <td className="p-2.5">
                              <span className="font-bold text-[#FFD700]">{pct}%</span>
                            </td>
                            <td className="p-2.5 font-mono">{s.actualStudyHours}h</td>
                            <td className="p-2.5 font-bold text-emerald-400">{s.mockExamAverage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === "mocks" && (
              <div>
                <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
                  Mock Exam Results & Mistake Journal
                </h3>
                <div className="space-y-3">
                  {mockExams.map((m) => (
                    <div key={m.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="font-bold text-white">Score: {m.marks} ({m.percentage}%)</span>
                        <span className="rounded bg-emerald-950 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/30">
                          Grade {m.grade}
                        </span>
                      </div>
                      <p className="mt-2 text-zinc-300"><span className="text-zinc-500 font-semibold">Mistakes logged:</span> {m.mistakes}</p>
                      <p className="mt-1 text-zinc-300"><span className="text-zinc-500 font-semibold">Weak areas:</span> {m.weakAreas}</p>
                      <p className="mt-1 text-amber-300"><span className="text-zinc-500 font-semibold">Improvement action:</span> {m.improvementNotes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportType === "tuition" && (
              <div>
                <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
                  Tuition Timetable & Monthly Fee Ledger
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="border-b border-zinc-700 bg-zinc-900/80 text-[11px] uppercase text-zinc-400">
                      <tr>
                        <th className="p-2.5">Day & Time</th>
                        <th className="p-2.5">Teacher</th>
                        <th className="p-2.5">Institute / Mode</th>
                        <th className="p-2.5">Monthly Fee</th>
                        <th className="p-2.5">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {tuitionClasses.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-900/40">
                          <td className="p-2.5 font-semibold text-white">{t.classDay} • {t.classTime}</td>
                          <td className="p-2.5">{t.teacherName}</td>
                          <td className="p-2.5 text-zinc-400">{t.institute} ({t.mode})</td>
                          <td className="p-2.5 font-bold text-[#FFD700]">LKR {Number(t.monthlyFee).toLocaleString()}</td>
                          <td className="p-2.5 font-mono">{t.attendanceCount} sessions</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === "revision" && (
              <div>
                <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
                  Recent Revision Logs
                </h3>
                <div className="space-y-2 text-xs">
                  {revisionLogs.slice(0, 15).map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                      <div>
                        <p className="font-semibold text-white">{r.topic}</p>
                        <p className="text-[11px] text-zinc-500">{new Date(r.reviewedAt).toLocaleDateString()} • {r.type}</p>
                      </div>
                      <span className="font-mono text-[#FFD700]">{r.minutes} min</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
