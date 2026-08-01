"use server";

import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import {
  appSettings,
  chapters,
  homeworkItems,
  mockExams,
  notes,
  pdfResources,
  revisionLogs,
  studySessions,
  subjects,
  todoItems,
  tuitionClasses,
} from "@/db/schema";

function num(v: FormDataEntryValue | null, fallback = 0) {
  if (v === null || v === "") return fallback;
  const parsed = Number(v);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(v: FormDataEntryValue | null) {
  return v === "on" || v === "true";
}

function str(v: FormDataEntryValue | null, fallback = "") {
  return (typeof v === "string" ? v : fallback).trim() || fallback;
}

function toDate(v: FormDataEntryValue | null) {
  const value = typeof v === "string" ? v : "";
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function ready() {
  await ensureDbInitialized();
}

function done() {
  revalidatePath("/");
}

// ------------------- SUBJECT ACTIONS -------------------
export async function createSubject(formData: FormData) {
  await ready();
  await db.insert(subjects).values({
    name: str(formData.get("name"), "Untitled Subject"),
    color: str(formData.get("color"), "#FFD700"),
    icon: str(formData.get("icon"), "📘"),
    teacher: str(formData.get("teacher")),
    tuitionInstitute: str(formData.get("tuitionInstitute")),
    priority: str(formData.get("priority"), "medium"),
    difficulty: str(formData.get("difficulty"), "medium"),
    totalChapters: num(formData.get("totalChapters"), 0),
    completedChapters: num(formData.get("completedChapters"), 0),
    estimatedStudyHours: String(num(formData.get("estimatedStudyHours"), 0)),
    actualStudyHours: String(num(formData.get("actualStudyHours"), 0)),
    notes: str(formData.get("notes")),
    resources: str(formData.get("resources")),
    weakTopics: str(formData.get("weakTopics")),
    strongTopics: str(formData.get("strongTopics")),
  });
  done();
}

export async function updateSubject(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  await db
    .update(subjects)
    .set({
      name: str(formData.get("name"), "Untitled Subject"),
      color: str(formData.get("color"), "#FFD700"),
      icon: str(formData.get("icon"), "📘"),
      teacher: str(formData.get("teacher")),
      tuitionInstitute: str(formData.get("tuitionInstitute")),
      priority: str(formData.get("priority"), "medium"),
      difficulty: str(formData.get("difficulty"), "medium"),
      completedChapters: num(formData.get("completedChapters"), 0),
      totalChapters: num(formData.get("totalChapters"), 0),
      estimatedStudyHours: String(num(formData.get("estimatedStudyHours"), 0)),
      actualStudyHours: String(num(formData.get("actualStudyHours"), 0)),
      revisionCount: num(formData.get("revisionCount"), 0),
      mockExamAverage: String(num(formData.get("mockExamAverage"), 0)),
      weakTopics: str(formData.get("weakTopics")),
      strongTopics: str(formData.get("strongTopics")),
      notes: str(formData.get("notes")),
      resources: str(formData.get("resources")),
      archived: bool(formData.get("archived")),
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, id));

  done();
}

export async function deleteSubject(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(subjects).where(eq(subjects.id, id));
  done();
}

export async function archiveSubject(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.update(subjects).set({ archived: true, updatedAt: new Date() }).where(eq(subjects.id, id));
  done();
}

export async function restoreSubject(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.update(subjects).set({ archived: false, updatedAt: new Date() }).where(eq(subjects.id, id));
  done();
}

// ------------------- CHAPTER ACTIONS -------------------
export async function createChapter(formData: FormData) {
  await ready();
  const subjectId = num(formData.get("subjectId"));
  if (!subjectId) return;

  await db.insert(chapters).values({
    subjectId,
    title: str(formData.get("title"), "New Chapter"),
    status: str(formData.get("status"), "pending"),
    difficulty: str(formData.get("difficulty"), "medium"),
    priority: str(formData.get("priority"), "medium"),
    progress: Math.max(0, Math.min(100, num(formData.get("progress"), 0))),
    notes: str(formData.get("notes")),
    resources: str(formData.get("resources")),
    homework: str(formData.get("homework")),
    estimatedMinutes: num(formData.get("estimatedMinutes"), 60),
    actualMinutes: num(formData.get("actualMinutes"), 0),
    revisionCounter: num(formData.get("revisionCounter"), 0),
  });

  // Increment total chapters on subject
  await db
    .update(subjects)
    .set({
      totalChapters: sql`${subjects.totalChapters} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, subjectId));

  done();
}

export async function updateChapter(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  const status = str(formData.get("status"), "pending");
  const progress = Math.max(0, Math.min(100, num(formData.get("progress"), 0)));

  await db
    .update(chapters)
    .set({
      title: str(formData.get("title")),
      status,
      difficulty: str(formData.get("difficulty"), "medium"),
      priority: str(formData.get("priority"), "medium"),
      progress: status === "completed" ? 100 : progress,
      estimatedMinutes: num(formData.get("estimatedMinutes")),
      actualMinutes: num(formData.get("actualMinutes")),
      revisionCounter: num(formData.get("revisionCounter")),
      notes: str(formData.get("notes")),
      resources: str(formData.get("resources")),
      homework: str(formData.get("homework")),
      completionDate: status === "completed" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(chapters.id, id));

  done();
}

export async function incrementChapterRevision(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  await db
    .update(chapters)
    .set({
      revisionCounter: sql`${chapters.revisionCounter} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(chapters.id, id));

  done();
}

export async function deleteChapter(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(chapters).where(eq(chapters.id, id));
  done();
}

// ------------------- TUITION CLASS ACTIONS -------------------
export async function createTuitionClass(formData: FormData) {
  await ready();
  await db.insert(tuitionClasses).values({
    subjectId: num(formData.get("subjectId"), 0) || null,
    teacherName: str(formData.get("teacherName"), "Unknown Teacher"),
    institute: str(formData.get("institute")),
    mode: str(formData.get("mode"), "physical"),
    address: str(formData.get("address")),
    contactNumber: str(formData.get("contactNumber")),
    whatsapp: str(formData.get("whatsapp")),
    classDay: str(formData.get("classDay"), "Sunday"),
    classTime: str(formData.get("classTime"), "08:00"),
    durationMinutes: num(formData.get("durationMinutes"), 120),
    monthlyFee: String(num(formData.get("monthlyFee"), 0)),
    upcomingDate: toDate(formData.get("upcomingDate")),
    homework: str(formData.get("homework")),
    notes: str(formData.get("notes")),
    reminderEnabled: bool(formData.get("reminderEnabled")),
  });
  done();
}

export async function updateTuitionClass(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  await db
    .update(tuitionClasses)
    .set({
      subjectId: num(formData.get("subjectId"), 0) || null,
      teacherName: str(formData.get("teacherName"), "Teacher"),
      institute: str(formData.get("institute")),
      mode: str(formData.get("mode"), "physical"),
      address: str(formData.get("address")),
      contactNumber: str(formData.get("contactNumber")),
      whatsapp: str(formData.get("whatsapp")),
      classDay: str(formData.get("classDay")),
      classTime: str(formData.get("classTime")),
      durationMinutes: num(formData.get("durationMinutes"), 120),
      monthlyFee: String(num(formData.get("monthlyFee"), 0)),
      upcomingDate: toDate(formData.get("upcomingDate")),
      homework: str(formData.get("homework")),
      notes: str(formData.get("notes")),
      reminderEnabled: bool(formData.get("reminderEnabled")),
      updatedAt: new Date(),
    })
    .where(eq(tuitionClasses.id, id));

  done();
}

export async function markTuitionAttendance(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  await db
    .update(tuitionClasses)
    .set({
      attendanceCount: sql`${tuitionClasses.attendanceCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(tuitionClasses.id, id));
  done();
}

export async function deleteTuitionClass(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(tuitionClasses).where(eq(tuitionClasses.id, id));
  done();
}

// ------------------- STUDY SESSION ACTIONS -------------------
export async function createStudySession(formData: FormData) {
  await ready();
  await db.insert(studySessions).values({
    subjectId: num(formData.get("subjectId"), 0) || null,
    title: str(formData.get("title"), "Study Session"),
    slot: str(formData.get("slot"), "morning"),
    plannedMinutes: num(formData.get("plannedMinutes"), 60),
    actualMinutes: num(formData.get("actualMinutes"), 0),
    date: toDate(formData.get("date")) ?? new Date(),
    notes: str(formData.get("notes")),
    completed: bool(formData.get("completed")),
  });
  done();
}

export async function completeStudySession(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  const actualMinutes = num(formData.get("actualMinutes"), 60);

  const session = await db.select().from(studySessions).where(eq(studySessions.id, id)).limit(1);
  if (session[0]?.subjectId) {
    // Add to subject actual hours
    const addedHours = actualMinutes / 60;
    await db
      .update(subjects)
      .set({
        actualStudyHours: sql`${subjects.actualStudyHours} + ${addedHours.toFixed(2)}::numeric`,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, session[0].subjectId));
  }

  await db
    .update(studySessions)
    .set({
      actualMinutes,
      completed: true,
      updatedAt: new Date(),
    })
    .where(eq(studySessions.id, id));
  done();
}

export async function deleteStudySession(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(studySessions).where(eq(studySessions.id, id));
  done();
}

export async function carryForwardMissedSessions() {
  await ready();
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(now);
  endToday.setHours(23, 59, 59, 999);

  const missed = await db
    .select()
    .from(studySessions)
    .where(and(lte(studySessions.date, endToday), eq(studySessions.completed, false), eq(studySessions.carriedForward, false)));

  for (const session of missed) {
    const tomorrow = new Date(startToday);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await db.insert(studySessions).values({
      subjectId: session.subjectId,
      title: session.title,
      slot: session.slot,
      plannedMinutes: session.plannedMinutes,
      notes: `${session.notes}\n[Auto carried forward from ${startToday.toDateString()}]`.trim(),
      date: tomorrow,
      carriedForward: true,
    });

    await db.update(studySessions).set({ carriedForward: true, updatedAt: new Date() }).where(eq(studySessions.id, session.id));
  }

  done();
}

// ------------------- HOMEWORK ACTIONS -------------------
export async function createHomework(formData: FormData) {
  await ready();
  await db.insert(homeworkItems).values({
    subjectId: num(formData.get("subjectId"), 0) || null,
    title: str(formData.get("title"), "Homework"),
    priority: str(formData.get("priority"), "medium"),
    dueDate: toDate(formData.get("dueDate")),
    reminder: bool(formData.get("reminder")),
    notes: str(formData.get("notes")),
  });
  done();
}

export async function completeHomework(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.update(homeworkItems).set({ status: "completed", updatedAt: new Date() }).where(eq(homeworkItems.id, id));
  done();
}

export async function reopenHomework(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.update(homeworkItems).set({ status: "pending", updatedAt: new Date() }).where(eq(homeworkItems.id, id));
  done();
}

export async function deleteHomework(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(homeworkItems).where(eq(homeworkItems.id, id));
  done();
}

// ------------------- REVISION LOG ACTIONS -------------------
export async function createRevisionLog(formData: FormData) {
  await ready();
  const subjectId = num(formData.get("subjectId"), 0) || null;
  const minutes = num(formData.get("minutes"), 30);

  await db.insert(revisionLogs).values({
    subjectId,
    topic: str(formData.get("topic"), "Revision Topic"),
    type: str(formData.get("type"), "daily"),
    minutes,
    weakTopic: bool(formData.get("weakTopic")),
    reviewedAt: toDate(formData.get("reviewedAt")) ?? new Date(),
    notes: str(formData.get("notes")),
  });

  if (subjectId) {
    await db
      .update(subjects)
      .set({
        revisionCount: sql`${subjects.revisionCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, subjectId));
  }

  done();
}

export async function deleteRevisionLog(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(revisionLogs).where(eq(revisionLogs.id, id));
  done();
}

// ------------------- MOCK EXAM ACTIONS -------------------
export async function createMockExam(formData: FormData) {
  await ready();
  const subjectId = num(formData.get("subjectId"), 0) || null;
  const marks = num(formData.get("marks"), 0);
  const total = num(formData.get("total"), 100) || 100;
  const percentage = Math.max(0, Math.min(100, (marks / total) * 100));

  let grade = "W";
  if (percentage >= 75) grade = "A";
  else if (percentage >= 65) grade = "B";
  else if (percentage >= 50) grade = "C";
  else if (percentage >= 35) grade = "S";

  const userGrade = str(formData.get("grade"));
  const finalGrade = userGrade && userGrade !== "N/A" ? userGrade : grade;

  await db.insert(mockExams).values({
    subjectId,
    examDate: toDate(formData.get("examDate")) ?? new Date(),
    marks: String(marks),
    percentage: percentage.toFixed(2),
    grade: finalGrade,
    timeTakenMinutes: num(formData.get("timeTakenMinutes"), 180),
    mistakes: str(formData.get("mistakes")),
    wrongQuestions: str(formData.get("wrongQuestions")),
    weakAreas: str(formData.get("weakAreas")),
    improvementNotes: str(formData.get("improvementNotes")),
  });

  if (subjectId) {
    // Recalculate average mock mark for subject
    const subjectMocks = await db.select().from(mockExams).where(eq(mockExams.subjectId, subjectId));
    if (subjectMocks.length > 0) {
      const avg = subjectMocks.reduce((sum, m) => sum + Number(m.percentage), 0) / subjectMocks.length;
      await db
        .update(subjects)
        .set({
          mockExamAverage: avg.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(subjects.id, subjectId));
    }
  }

  done();
}

export async function deleteMockExam(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(mockExams).where(eq(mockExams.id, id));
  done();
}

// ------------------- NOTES ACTIONS -------------------
export async function createNote(formData: FormData) {
  await ready();
  await db.insert(notes).values({
    subjectId: num(formData.get("subjectId"), 0) || null,
    title: str(formData.get("title"), "Untitled Note"),
    content: str(formData.get("content")),
    tags: str(formData.get("tags")),
    category: str(formData.get("category"), "general"),
    bookmarked: bool(formData.get("bookmarked")),
    attachmentUrl: str(formData.get("attachmentUrl")),
  });
  done();
}

export async function updateNote(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;

  await db
    .update(notes)
    .set({
      subjectId: num(formData.get("subjectId"), 0) || null,
      title: str(formData.get("title"), "Untitled Note"),
      content: str(formData.get("content")),
      tags: str(formData.get("tags")),
      category: str(formData.get("category"), "general"),
      bookmarked: bool(formData.get("bookmarked")),
      attachmentUrl: str(formData.get("attachmentUrl")),
      updatedAt: new Date(),
    })
    .where(eq(notes.id, id));

  done();
}

export async function toggleBookmarkNote(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  const current = bool(formData.get("current"));
  await db.update(notes).set({ bookmarked: !current, updatedAt: new Date() }).where(eq(notes.id, id));
  done();
}

export async function deleteNote(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(notes).where(eq(notes.id, id));
  done();
}

// ------------------- PDF / RESOURCE LIBRARY ACTIONS -------------------
export async function createPdfResource(formData: FormData) {
  await ready();
  await db.insert(pdfResources).values({
    subjectId: num(formData.get("subjectId"), 0) || null,
    title: str(formData.get("title"), "New Study Resource"),
    type: str(formData.get("type"), "Past Paper"),
    year: num(formData.get("year"), 2024),
    medium: str(formData.get("medium"), "Sinhala"),
    url: str(formData.get("url")),
    fileSize: str(formData.get("fileSize"), "2.0 MB"),
    bookmarked: bool(formData.get("bookmarked")),
    description: str(formData.get("description")),
  });
  done();
}

export async function toggleBookmarkPdf(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  const current = bool(formData.get("current"));
  await db.update(pdfResources).set({ bookmarked: !current }).where(eq(pdfResources.id, id));
  done();
}

export async function deletePdfResource(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(pdfResources).where(eq(pdfResources.id, id));
  done();
}

// ------------------- TODO ITEMS ACTIONS -------------------
export async function createTodo(formData: FormData) {
  await ready();
  await db.insert(todoItems).values({
    title: str(formData.get("title"), "Task"),
    priority: str(formData.get("priority"), "medium"),
    recurring: str(formData.get("recurring"), "none"),
    dueDate: toDate(formData.get("dueDate")),
  });
  done();
}

export async function toggleTodo(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  const next = bool(formData.get("next"));
  await db.update(todoItems).set({ completed: next, updatedAt: new Date() }).where(eq(todoItems.id, id));
  done();
}

export async function deleteTodo(formData: FormData) {
  await ready();
  const id = num(formData.get("id"));
  if (!id) return;
  await db.delete(todoItems).where(eq(todoItems.id, id));
  done();
}

// ------------------- SETTINGS & BACKUP ACTIONS -------------------
export async function updateSettings(formData: FormData) {
  await ready();
  const settings = await db.select().from(appSettings).limit(1);
  const row = settings[0];
  if (!row) return;

  await db
    .update(appSettings)
    .set({
      theme: str(formData.get("theme"), "dark"),
      accentColor: str(formData.get("accentColor"), "#FFD700"),
      notifications: bool(formData.get("notifications")),
      autoSave: bool(formData.get("autoSave")),
      keyboardShortcuts: bool(formData.get("keyboardShortcuts")),
      updatedAt: new Date(),
    })
    .where(eq(appSettings.id, row.id));

  done();
}

export async function saveBackup() {
  await ready();

  const [s, c, t, ss, h, r, m, n, p, td] = await Promise.all([
    db.select().from(subjects),
    db.select().from(chapters),
    db.select().from(tuitionClasses),
    db.select().from(studySessions),
    db.select().from(homeworkItems),
    db.select().from(revisionLogs),
    db.select().from(mockExams),
    db.select().from(notes),
    db.select().from(pdfResources),
    db.select().from(todoItems),
  ]);

  const payload = JSON.stringify({
    savedAt: new Date().toISOString(),
    owner: "Chamindu Gimhana",
    exam: "Sri Lanka G.C.E O/L 2026",
    subjects: s,
    chapters: c,
    tuitionClasses: t,
    studySessions: ss,
    homeworkItems: h,
    revisionLogs: r,
    mockExams: m,
    notes: n,
    pdfResources: p,
    todoItems: td,
  });

  const setting = (await db.select().from(appSettings).limit(1))[0];
  if (!setting) return;
  await db.update(appSettings).set({ backupJson: payload, updatedAt: new Date() }).where(eq(appSettings.id, setting.id));

  done();
}

export async function restoreBackup() {
  await ready();
  const setting = (await db.select().from(appSettings).limit(1))[0];
  if (!setting?.backupJson) return;

  try {
    const parsed = JSON.parse(setting.backupJson) as {
      subjects: (typeof subjects.$inferInsert)[];
      chapters: (typeof chapters.$inferInsert)[];
      tuitionClasses: (typeof tuitionClasses.$inferInsert)[];
      studySessions: (typeof studySessions.$inferInsert)[];
      homeworkItems: (typeof homeworkItems.$inferInsert)[];
      revisionLogs: (typeof revisionLogs.$inferInsert)[];
      mockExams: (typeof mockExams.$inferInsert)[];
      notes: (typeof notes.$inferInsert)[];
      pdfResources: (typeof pdfResources.$inferInsert)[];
      todoItems: (typeof todoItems.$inferInsert)[];
    };

    await db.delete(chapters);
    await db.delete(tuitionClasses);
    await db.delete(studySessions);
    await db.delete(homeworkItems);
    await db.delete(revisionLogs);
    await db.delete(mockExams);
    await db.delete(notes);
    await db.delete(pdfResources);
    await db.delete(todoItems);
    await db.delete(subjects);

    if (parsed.subjects?.length) {
      await db.insert(subjects).values(parsed.subjects.map(({ id, ...rest }) => rest));
    }
    if (parsed.chapters?.length) {
      await db.insert(chapters).values(parsed.chapters.map(({ id, ...rest }) => rest));
    }
    if (parsed.tuitionClasses?.length) {
      await db.insert(tuitionClasses).values(parsed.tuitionClasses.map(({ id, ...rest }) => rest));
    }
    if (parsed.studySessions?.length) {
      await db.insert(studySessions).values(parsed.studySessions.map(({ id, ...rest }) => rest));
    }
    if (parsed.homeworkItems?.length) {
      await db.insert(homeworkItems).values(parsed.homeworkItems.map(({ id, ...rest }) => rest));
    }
    if (parsed.revisionLogs?.length) {
      await db.insert(revisionLogs).values(parsed.revisionLogs.map(({ id, ...rest }) => rest));
    }
    if (parsed.mockExams?.length) {
      await db.insert(mockExams).values(parsed.mockExams.map(({ id, ...rest }) => rest));
    }
    if (parsed.notes?.length) {
      await db.insert(notes).values(parsed.notes.map(({ id, ...rest }) => rest));
    }
    if (parsed.pdfResources?.length) {
      await db.insert(pdfResources).values(parsed.pdfResources.map(({ id, ...rest }) => rest));
    }
    if (parsed.todoItems?.length) {
      await db.insert(todoItems).values(parsed.todoItems.map(({ id, ...rest }) => rest));
    }
  } catch (e) {
    console.error("Failed to restore backup", e);
  }

  done();
}

export async function resetToDefaultSeedData() {
  await ready();
  await db.delete(chapters);
  await db.delete(tuitionClasses);
  await db.delete(studySessions);
  await db.delete(homeworkItems);
  await db.delete(revisionLogs);
  await db.delete(mockExams);
  await db.delete(notes);
  await db.delete(pdfResources);
  await db.delete(todoItems);
  await db.delete(subjects);

  // Trigger init seed
  const { ensureDbInitialized } = await import("@/db/init");
  await ensureDbInitialized();
  done();
}

// ------------------- DASHBOARD DATA AGGREGATION -------------------
export async function getDashboardData(params: { search?: string; sort?: string; archived?: string }) {
  await ready();

  const search = params.search?.trim();
  const archivedFilter = params.archived ?? "active";
  const sortBy = params.sort ?? "name_asc";

  const subjectWhere: Array<ReturnType<typeof ilike> | ReturnType<typeof eq>> = [];
  if (archivedFilter === "archived") {
    subjectWhere.push(eq(subjects.archived, true));
  } else if (archivedFilter === "all") {
    // no archived clause
  } else {
    subjectWhere.push(eq(subjects.archived, false));
  }

  if (search) {
    subjectWhere.push(ilike(subjects.name, `%${search}%`));
  }

  const orderExpr =
    sortBy === "name_desc"
      ? desc(subjects.name)
      : sortBy === "priority"
        ? asc(subjects.priority)
        : sortBy === "difficulty"
          ? asc(subjects.difficulty)
          : asc(subjects.name);

  const whereClause = subjectWhere.length
    ? subjectWhere.slice(1).reduce((acc, part) => and(acc, part) as NonNullable<typeof acc>, subjectWhere[0])
    : undefined;

  const now = new Date();
  const startDay = new Date(now);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(now);
  endDay.setHours(23, 59, 59, 999);

  const [
    subjectRows,
    chapterRows,
    tuitionRows,
    homeworkRows,
    sessionRows,
    revisionRows,
    mockRows,
    noteRows,
    pdfRows,
    todoRows,
    settingsRows,
  ] = await Promise.all([
    whereClause
      ? db.select().from(subjects).where(whereClause).orderBy(orderExpr)
      : db.select().from(subjects).orderBy(orderExpr),
    db.select().from(chapters).orderBy(asc(chapters.subjectId), asc(chapters.title)),
    db.select().from(tuitionClasses).orderBy(asc(tuitionClasses.classDay), asc(tuitionClasses.classTime)),
    db.select().from(homeworkItems).orderBy(asc(homeworkItems.dueDate)),
    db.select().from(studySessions).orderBy(desc(studySessions.date)),
    db.select().from(revisionLogs).orderBy(desc(revisionLogs.reviewedAt)),
    db.select().from(mockExams).orderBy(desc(mockExams.examDate)),
    db.select().from(notes).orderBy(desc(notes.updatedAt)),
    db.select().from(pdfResources).orderBy(desc(pdfResources.year), asc(pdfResources.title)),
    db.select().from(todoItems).orderBy(asc(todoItems.completed), desc(todoItems.createdAt)),
    db.select().from(appSettings).limit(1),
  ]);

  const todaySessions = await db
    .select()
    .from(studySessions)
    .where(and(gte(studySessions.date, startDay), lte(studySessions.date, endDay)));

  const plannedToday = todaySessions.reduce((acc, s) => acc + s.plannedMinutes, 0);
  const actualToday = todaySessions.reduce((acc, s) => acc + s.actualMinutes, 0);

  return {
    subjects: subjectRows,
    chapters: chapterRows,
    tuitionClasses: tuitionRows,
    homeworkItems: homeworkRows,
    studySessions: sessionRows,
    revisionLogs: revisionRows,
    mockExams: mockRows,
    notes: noteRows,
    pdfResources: pdfRows,
    todoItems: todoRows,
    settings: settingsRows[0] ?? null,
    metrics: {
      plannedToday,
      actualToday,
      remainingToday: Math.max(0, plannedToday - actualToday),
      missedToday: Math.max(0, plannedToday - actualToday),
    },
  };
}
