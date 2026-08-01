import { boolean, integer, numeric, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  color: varchar("color", { length: 20 }).notNull().default("#FFD700"),
  icon: varchar("icon", { length: 40 }).notNull().default("📘"),
  teacher: varchar("teacher", { length: 120 }).default(""),
  tuitionInstitute: varchar("tuition_institute", { length: 180 }).default(""),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("medium"),
  totalChapters: integer("total_chapters").notNull().default(0),
  completedChapters: integer("completed_chapters").notNull().default(0),
  estimatedStudyHours: numeric("estimated_study_hours", { precision: 8, scale: 2 }).notNull().default("0"),
  actualStudyHours: numeric("actual_study_hours", { precision: 8, scale: 2 }).notNull().default("0"),
  notes: text("notes").notNull().default(""),
  resources: text("resources").notNull().default(""),
  revisionCount: integer("revision_count").notNull().default(0),
  mockExamAverage: numeric("mock_exam_average", { precision: 5, scale: 2 }).notNull().default("0"),
  weakTopics: text("weak_topics").notNull().default(""),
  strongTopics: text("strong_topics").notNull().default(""),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("medium"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  progress: integer("progress").notNull().default(0),
  notes: text("notes").notNull().default(""),
  resources: text("resources").notNull().default(""),
  homework: text("homework").notNull().default(""),
  estimatedMinutes: integer("estimated_minutes").notNull().default(0),
  actualMinutes: integer("actual_minutes").notNull().default(0),
  revisionCounter: integer("revision_counter").notNull().default(0),
  completionDate: timestamp("completion_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tuitionClasses = pgTable("tuition_classes", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  teacherName: varchar("teacher_name", { length: 120 }).notNull(),
  institute: varchar("institute", { length: 180 }).notNull().default(""),
  mode: varchar("mode", { length: 20 }).notNull().default("physical"),
  address: text("address").notNull().default(""),
  contactNumber: varchar("contact_number", { length: 40 }).notNull().default(""),
  whatsapp: varchar("whatsapp", { length: 40 }).notNull().default(""),
  classDay: varchar("class_day", { length: 20 }).notNull(),
  classTime: varchar("class_time", { length: 20 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(120),
  monthlyFee: numeric("monthly_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  attendanceCount: integer("attendance_count").notNull().default(0),
  upcomingDate: timestamp("upcoming_date", { withTimezone: true }),
  homework: text("homework").notNull().default(""),
  notes: text("notes").notNull().default(""),
  reminderEnabled: boolean("reminder_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  slot: varchar("slot", { length: 20 }).notNull().default("morning"),
  plannedMinutes: integer("planned_minutes").notNull().default(60),
  actualMinutes: integer("actual_minutes").notNull().default(0),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
  carriedForward: boolean("carried_forward").notNull().default(false),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const homeworkItems = pgTable("homework_items", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  reminder: boolean("reminder").notNull().default(true),
  notes: text("notes").notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const revisionLogs = pgTable("revision_logs", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  topic: varchar("topic", { length: 200 }).notNull(),
  type: varchar("type", { length: 30 }).notNull().default("daily"),
  minutes: integer("minutes").notNull().default(30),
  weakTopic: boolean("weak_topic").notNull().default(false),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
  notes: text("notes").notNull().default(""),
});

export const mockExams = pgTable("mock_exams", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull().defaultNow(),
  marks: numeric("marks", { precision: 6, scale: 2 }).notNull().default("0"),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  grade: varchar("grade", { length: 10 }).notNull().default("N/A"),
  timeTakenMinutes: integer("time_taken_minutes").notNull().default(0),
  mistakes: text("mistakes").notNull().default(""),
  wrongQuestions: text("wrong_questions").notNull().default(""),
  weakAreas: text("weak_areas").notNull().default(""),
  improvementNotes: text("improvement_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  title: varchar("title", { length: 180 }).notNull(),
  content: text("content").notNull().default(""),
  tags: text("tags").notNull().default(""),
  category: varchar("category", { length: 60 }).notNull().default("general"),
  bookmarked: boolean("bookmarked").notNull().default(false),
  attachmentUrl: text("attachment_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const todoItems = pgTable("todo_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  recurring: varchar("recurring", { length: 20 }).notNull().default("none"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pdfResources = pgTable("pdf_resources", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("Past Paper"), // Past Paper, Model Paper, Notes, Books, Marking Schemes
  year: integer("year").default(2024),
  medium: varchar("medium", { length: 20 }).notNull().default("Sinhala"),
  url: text("url").notNull().default(""),
  fileSize: varchar("file_size", { length: 30 }).notNull().default("1.5 MB"),
  bookmarked: boolean("bookmarked").notNull().default(false),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  theme: varchar("theme", { length: 20 }).notNull().default("dark"),
  accentColor: varchar("accent_color", { length: 20 }).notNull().default("#FFD700"),
  notifications: boolean("notifications").notNull().default(true),
  autoSave: boolean("auto_save").notNull().default(true),
  keyboardShortcuts: boolean("keyboard_shortcuts").notNull().default(true),
  backupJson: text("backup_json").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Subject = typeof subjects.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type TuitionClass = typeof tuitionClasses.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;
export type HomeworkItem = typeof homeworkItems.$inferSelect;
export type RevisionLog = typeof revisionLogs.$inferSelect;
export type MockExam = typeof mockExams.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type TodoItem = typeof todoItems.$inferSelect;
export type PdfResource = typeof pdfResources.$inferSelect;
export type AppSetting = typeof appSettings.$inferSelect;
