import { sql } from "drizzle-orm";
import { db } from "@/db";
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

const globalForInit = globalThis as typeof globalThis & {
  __studyTrackerDbInitPromise?: Promise<void>;
};

async function initialize() {
  await db.execute(sql`
    create table if not exists subjects (
      id serial primary key,
      name varchar(120) not null,
      color varchar(20) not null default '#FFD700',
      icon varchar(40) not null default '📘',
      teacher varchar(120) default '',
      tuition_institute varchar(180) default '',
      priority varchar(20) not null default 'medium',
      difficulty varchar(20) not null default 'medium',
      total_chapters integer not null default 0,
      completed_chapters integer not null default 0,
      estimated_study_hours numeric(8,2) not null default 0,
      actual_study_hours numeric(8,2) not null default 0,
      notes text not null default '',
      resources text not null default '',
      revision_count integer not null default 0,
      mock_exam_average numeric(5,2) not null default 0,
      weak_topics text not null default '',
      strong_topics text not null default '',
      archived boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists chapters (
      id serial primary key,
      subject_id integer not null references subjects(id) on delete cascade,
      title varchar(200) not null,
      status varchar(30) not null default 'pending',
      difficulty varchar(20) not null default 'medium',
      priority varchar(20) not null default 'medium',
      progress integer not null default 0,
      notes text not null default '',
      resources text not null default '',
      homework text not null default '',
      estimated_minutes integer not null default 0,
      actual_minutes integer not null default 0,
      revision_counter integer not null default 0,
      completion_date timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists tuition_classes (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      teacher_name varchar(120) not null,
      institute varchar(180) not null default '',
      mode varchar(20) not null default 'physical',
      address text not null default '',
      contact_number varchar(40) not null default '',
      whatsapp varchar(40) not null default '',
      class_day varchar(20) not null,
      class_time varchar(20) not null,
      duration_minutes integer not null default 120,
      monthly_fee numeric(10,2) not null default 0,
      attendance_count integer not null default 0,
      upcoming_date timestamptz,
      homework text not null default '',
      notes text not null default '',
      reminder_enabled boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists study_sessions (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      title varchar(200) not null,
      slot varchar(20) not null default 'morning',
      planned_minutes integer not null default 60,
      actual_minutes integer not null default 0,
      date timestamptz not null default now(),
      completed boolean not null default false,
      carried_forward boolean not null default false,
      notes text not null default '',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists homework_items (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      title varchar(200) not null,
      priority varchar(20) not null default 'medium',
      due_date timestamptz,
      reminder boolean not null default true,
      notes text not null default '',
      status varchar(20) not null default 'pending',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists revision_logs (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      topic varchar(200) not null,
      type varchar(30) not null default 'daily',
      minutes integer not null default 30,
      weak_topic boolean not null default false,
      reviewed_at timestamptz not null default now(),
      notes text not null default ''
    )
  `);

  await db.execute(sql`
    create table if not exists mock_exams (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      exam_date timestamptz not null default now(),
      marks numeric(6,2) not null default 0,
      percentage numeric(5,2) not null default 0,
      grade varchar(10) not null default 'N/A',
      time_taken_minutes integer not null default 0,
      mistakes text not null default '',
      wrong_questions text not null default '',
      weak_areas text not null default '',
      improvement_notes text not null default '',
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists notes (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      title varchar(180) not null,
      content text not null default '',
      tags text not null default '',
      category varchar(60) not null default 'general',
      bookmarked boolean not null default false,
      attachment_url text not null default '',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists todo_items (
      id serial primary key,
      title varchar(200) not null,
      priority varchar(20) not null default 'medium',
      recurring varchar(20) not null default 'none',
      due_date timestamptz,
      completed boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists pdf_resources (
      id serial primary key,
      subject_id integer references subjects(id) on delete set null,
      title varchar(200) not null,
      type varchar(50) not null default 'Past Paper',
      year integer default 2024,
      medium varchar(20) not null default 'Sinhala',
      url text not null default '',
      file_size varchar(30) not null default '1.5 MB',
      bookmarked boolean not null default false,
      description text not null default '',
      created_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    create table if not exists app_settings (
      id serial primary key,
      theme varchar(20) not null default 'dark',
      accent_color varchar(20) not null default '#FFD700',
      notifications boolean not null default true,
      auto_save boolean not null default true,
      keyboard_shortcuts boolean not null default true,
      backup_json text not null default '',
      updated_at timestamptz not null default now()
    )
  `);

  await db.execute(sql`
    insert into app_settings (theme, accent_color)
    select 'dark', '#FFD700'
    where not exists (select 1 from app_settings)
  `);

  // Seed default 8 O/L subjects for Chamindu Gimhana if table is empty
  const subjectCountRes = await db.select({ count: sql<number>`count(*)::int` }).from(subjects);
  const count = subjectCountRes[0]?.count ?? 0;

  if (count === 0) {
    await seedOLLearnerData();
  }
}

async function seedOLLearnerData() {
  const initialSubjects = [
    {
      name: "Mathematics",
      color: "#FFD700",
      icon: "📐",
      teacher: "Mr. Kapila Bandara",
      tuitionInstitute: "Sasip Institute - Nugegoda",
      priority: "high",
      difficulty: "hard",
      totalChapters: 16,
      completedChapters: 10,
      estimatedStudyHours: "90.00",
      actualStudyHours: "54.50",
      notes: "Focus heavily on Geometry theorems, Quadratic equations, Trigonometry, and Probability. Maintain past papers speed drills.",
      resources: "Past Papers 2016-2024, Kapila Sir Theory Tutes, Master Maths Question Bank",
      revisionCount: 14,
      mockExamAverage: "84.50",
      weakTopics: "Trigonometric ratios 3D elevation, Circle theorem proofs, Quadratic graphs",
      strongTopics: "Matrices, Linear Equations, Arithmetic & Geometric Progressions, Sets",
    },
    {
      name: "Science",
      color: "#00E5FF",
      icon: "🔬",
      teacher: "Dr. Janaka Gunasekara",
      tuitionInstitute: "Syzygy - Gampaha & Online",
      priority: "high",
      difficulty: "hard",
      totalChapters: 18,
      completedChapters: 12,
      estimatedStudyHours: "95.00",
      actualStudyHours: "62.00",
      notes: "Cover Biology diagrams (Heart, Eye, Photosynthesis), Physics calculations (Newton's Laws, Electricity, Optics), and Chemistry equations.",
      resources: "Janaka Sir Module 1-4, Science Practical Workbook, NIE Teacher Guide",
      revisionCount: 18,
      mockExamAverage: "88.00",
      weakTopics: "Electric circuits with internal resistance, Organic chemistry reactions, Genetics Punnett squares",
      strongTopics: "Human Digestion, Newton's Laws, Periodic Table, Acids and Bases",
    },
    {
      name: "English",
      color: "#00E676",
      icon: "🇬🇧",
      teacher: "Mrs. Kanthi Perera",
      tuitionInstitute: "Sakya - Nugegoda",
      priority: "high",
      difficulty: "medium",
      totalChapters: 12,
      completedChapters: 8,
      estimatedStudyHours: "55.00",
      actualStudyHours: "34.00",
      notes: "Practice formal/informal letters, essays (200 words), dialogue writing, reading comprehension, and active/passive voice.",
      resources: "Past Paper Compilations 2015-2024, English Grammar in Use, Model Papers Book",
      revisionCount: 9,
      mockExamAverage: "86.50",
      weakTopics: "Conditional sentences (Type 3), Prepositions in complex phrases, Report writing format",
      strongTopics: "Reading Comprehension, Notice writing, Tenses, Vocabulary & Synonyms",
    },
    {
      name: "Sinhala",
      color: "#FF9100",
      icon: "📖",
      teacher: "Mr. Sarath Wijesinghe",
      tuitionInstitute: "Rotary - Nugegoda",
      priority: "high",
      difficulty: "medium",
      totalChapters: 14,
      completedChapters: 9,
      estimatedStudyHours: "60.00",
      actualStudyHours: "42.00",
      notes: "Gadyawa (Prose) and Padyawa (Poetry) appreciations, Vyakaranaya (Akshara vinyasaya, Samasa, Kriya pada), Essay writing.",
      resources: "Sahithya Sangrahaya, Sarath Sir Grammar Tute, O/L Sinhala Past Papers",
      revisionCount: 11,
      mockExamAverage: "82.00",
      weakTopics: "Sandhi vidhi rules, Classical poetry appreciation (Kavyashekhara), Archaic words",
      strongTopics: "Essay writing, Reading passage answering, Modern prose commentary, Letter writing",
    },
    {
      name: "History",
      color: "#FF5252",
      icon: "🏛️",
      teacher: "Mr. Upul Shantha",
      tuitionInstitute: "Apex Institute & Online Live",
      priority: "medium",
      difficulty: "hard",
      totalChapters: 10,
      completedChapters: 6,
      estimatedStudyHours: "50.00",
      actualStudyHours: "31.00",
      notes: "Memorize key dates, map markings (ancient ports, reservoirs, monastic complexes), and historical significance points.",
      resources: "Grade 10 & 11 History Textbooks, Upul Sir Map Guide, Model Exam Papers",
      revisionCount: 12,
      mockExamAverage: "79.00",
      weakTopics: "Map marking locations (Gokanna, Godawaya), Constitutional reforms (Colebrooke to Soulbury)",
      strongTopics: "Anuradhapura irrigation system, King Dutugemunu era, World War 1 & 2 causes",
    },
    {
      name: "Commerce",
      color: "#E040FB",
      icon: "💼",
      teacher: "Mr. Nimal Jayawardena",
      tuitionInstitute: "Rotary - Nugegoda",
      priority: "medium",
      difficulty: "medium",
      totalChapters: 12,
      completedChapters: 8,
      estimatedStudyHours: "50.00",
      actualStudyHours: "33.50",
      notes: "Double entry bookkeeping, Trial balance, Profit and Loss statements, Financial balance sheets, Banking and Insurance basics.",
      resources: "Commerce & Accounting Textbooks, Nimal Sir Tutes, 10 Years Past Papers",
      revisionCount: 10,
      mockExamAverage: "89.00",
      weakTopics: "Bank reconciliation statement adjustments, Depreciation calculation methods",
      strongTopics: "Ledger posting, Trading profit & loss account, Marketing concepts, Banking services",
    },
    {
      name: "ICT",
      color: "#7C4DFF",
      icon: "💻",
      teacher: "Mr. Chamara Wickramasinghe",
      tuitionInstitute: "Online Tech Academy",
      priority: "high",
      difficulty: "medium",
      totalChapters: 10,
      completedChapters: 7,
      estimatedStudyHours: "55.00",
      actualStudyHours: "39.00",
      notes: "Number systems (Binary, Octal, Hexadecimal), Logic Gates, Algorithms & Flowcharts, Pascal & Python, Database & SQL, HTML & CSS.",
      resources: "ICT Past Papers 2014-2024, Chamara Sir Code Workbook, NIE Syllabus Resource",
      revisionCount: 15,
      mockExamAverage: "92.00",
      weakTopics: "Complex Flowchart loop traces, SQL joins and group-by clauses, Parity check error detection",
      strongTopics: "Number conversions, Truth tables and Boolean algebra, HTML web markup, Hardware specs",
    },
    {
      name: "Drama",
      color: "#FFAB40",
      icon: "🎭",
      teacher: "Mr. Rohan Samaranayake",
      tuitionInstitute: "Sudharshi Cultural Centre - Colombo 07",
      priority: "medium",
      difficulty: "easy",
      totalChapters: 8,
      completedChapters: 6,
      estimatedStudyHours: "35.00",
      actualStudyHours: "24.00",
      notes: "Sri Lankan traditional drama forms (Kolam, Sokari, Nadagam), Nurthi theatre, Modern stage plays (Maname, Sinhabahu), Acting & Stagecraft.",
      resources: "Drama Textbook Grade 10-11, Rohan Sir Drama Anthology, Model Question Papers",
      revisionCount: 8,
      mockExamAverage: "85.00",
      weakTopics: "Ranga wasthra (costume) analysis of Kolam characters, Greek tragedy origins",
      strongTopics: "Sokari drama rituals, Sarachchandra's plays (Maname/Sinhabahu), Stage lighting & direction",
    },
  ];

  const insertedSubjects = await db.insert(subjects).values(initialSubjects).returning();

  // Create chapters for each subject
  const mathSubject = insertedSubjects.find((s) => s.name === "Mathematics");
  if (mathSubject) {
    await db.insert(chapters).values([
      { subjectId: mathSubject.id, title: "Real Numbers & Fractions", status: "completed", difficulty: "easy", priority: "high", progress: 100, estimatedMinutes: 180, actualMinutes: 160, revisionCounter: 3 },
      { subjectId: mathSubject.id, title: "Indices & Logarithms", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 240, actualMinutes: 220, revisionCounter: 4 },
      { subjectId: mathSubject.id, title: "Algebraic Expressions & Factorization", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 300, actualMinutes: 280, revisionCounter: 3 },
      { subjectId: mathSubject.id, title: "Quadratic Equations & Graphs", status: "completed", difficulty: "hard", priority: "high", progress: 90, estimatedMinutes: 360, actualMinutes: 340, revisionCounter: 4 },
      { subjectId: mathSubject.id, title: "Geometric Theorems & Proofs (Circle)", status: "in-progress", difficulty: "hard", priority: "high", progress: 65, estimatedMinutes: 420, actualMinutes: 260, revisionCounter: 2 },
      { subjectId: mathSubject.id, title: "Trigonometry & Angles of Elevation", status: "in-progress", difficulty: "hard", priority: "high", progress: 70, estimatedMinutes: 360, actualMinutes: 240, revisionCounter: 2 },
      { subjectId: mathSubject.id, title: "Statistics: Mean, Median, Frequency Polygon", status: "completed", difficulty: "medium", priority: "medium", progress: 100, estimatedMinutes: 240, actualMinutes: 210, revisionCounter: 2 },
      { subjectId: mathSubject.id, title: "Probability & Tree Diagrams", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 200, actualMinutes: 190, revisionCounter: 3 },
      { subjectId: mathSubject.id, title: "Matrices & Transformations", status: "completed", difficulty: "easy", priority: "medium", progress: 100, estimatedMinutes: 180, actualMinutes: 150, revisionCounter: 2 },
      { subjectId: mathSubject.id, title: "Sets & Venn Diagrams", status: "completed", difficulty: "easy", priority: "medium", progress: 100, estimatedMinutes: 150, actualMinutes: 130, revisionCounter: 2 },
      { subjectId: mathSubject.id, title: "Volume, Surface Area of Prisms & Pyramids", status: "pending", difficulty: "medium", priority: "medium", progress: 30, estimatedMinutes: 240, actualMinutes: 70, revisionCounter: 1 },
      { subjectId: mathSubject.id, title: "Constructions with Ruler and Compasses", status: "pending", difficulty: "medium", priority: "medium", progress: 20, estimatedMinutes: 200, actualMinutes: 40, revisionCounter: 0 },
    ]);
  }

  const scienceSubject = insertedSubjects.find((s) => s.name === "Science");
  if (scienceSubject) {
    await db.insert(chapters).values([
      { subjectId: scienceSubject.id, title: "Biological Processes: Photosynthesis & Respiration", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 240, actualMinutes: 230, revisionCounter: 4 },
      { subjectId: scienceSubject.id, title: "Human Organ Systems: Circulation & Excretion", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 280, actualMinutes: 260, revisionCounter: 3 },
      { subjectId: scienceSubject.id, title: "Genetics & Inheritance Patterns", status: "in-progress", difficulty: "hard", priority: "high", progress: 75, estimatedMinutes: 300, actualMinutes: 210, revisionCounter: 2 },
      { subjectId: scienceSubject.id, title: "Structure of Matter & Periodic Table", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 240, actualMinutes: 220, revisionCounter: 3 },
      { subjectId: scienceSubject.id, title: "Chemical Reactions, Rates & Energy Changes", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 260, actualMinutes: 240, revisionCounter: 2 },
      { subjectId: scienceSubject.id, title: "Acids, Bases & Salts", status: "completed", difficulty: "easy", priority: "medium", progress: 100, estimatedMinutes: 180, actualMinutes: 170, revisionCounter: 3 },
      { subjectId: scienceSubject.id, title: "Newton's Laws of Motion & Momentum", status: "completed", difficulty: "hard", priority: "high", progress: 100, estimatedMinutes: 320, actualMinutes: 310, revisionCounter: 3 },
      { subjectId: scienceSubject.id, title: "Current Electricity & Circuits (Ohm's Law)", status: "in-progress", difficulty: "hard", priority: "high", progress: 80, estimatedMinutes: 340, actualMinutes: 270, revisionCounter: 2 },
      { subjectId: scienceSubject.id, title: "Light: Reflection, Refraction & Optical Lenses", status: "pending", difficulty: "medium", priority: "medium", progress: 40, estimatedMinutes: 260, actualMinutes: 100, revisionCounter: 1 },
      { subjectId: scienceSubject.id, title: "Waves & Sound Acoustics", status: "pending", difficulty: "medium", priority: "medium", progress: 20, estimatedMinutes: 200, actualMinutes: 40, revisionCounter: 0 },
    ]);
  }

  const ictSubject = insertedSubjects.find((s) => s.name === "ICT");
  if (ictSubject) {
    await db.insert(chapters).values([
      { subjectId: ictSubject.id, title: "Number Systems & Binary Conversions", status: "completed", difficulty: "easy", priority: "high", progress: 100, estimatedMinutes: 180, actualMinutes: 160, revisionCounter: 5 },
      { subjectId: ictSubject.id, title: "Boolean Logic Gates & Truth Tables", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 200, actualMinutes: 190, revisionCounter: 4 },
      { subjectId: ictSubject.id, title: "Algorithms, Flowcharts & Pseudo-code", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 260, actualMinutes: 250, revisionCounter: 4 },
      { subjectId: ictSubject.id, title: "Pascal & Python Programming Fundamentals", status: "in-progress", difficulty: "hard", priority: "high", progress: 85, estimatedMinutes: 360, actualMinutes: 300, revisionCounter: 3 },
      { subjectId: ictSubject.id, title: "Database Management & SQL Queries", status: "completed", difficulty: "medium", priority: "high", progress: 100, estimatedMinutes: 220, actualMinutes: 210, revisionCounter: 3 },
      { subjectId: ictSubject.id, title: "Web Development: HTML5 & CSS3 Styling", status: "completed", difficulty: "easy", priority: "medium", progress: 100, estimatedMinutes: 180, actualMinutes: 160, revisionCounter: 2 },
      { subjectId: ictSubject.id, title: "Computer Networks, IP & Topologies", status: "pending", difficulty: "medium", priority: "medium", progress: 50, estimatedMinutes: 200, actualMinutes: 100, revisionCounter: 1 },
      { subjectId: ictSubject.id, title: "ICT in Society, Security & Ethical Issues", status: "pending", difficulty: "easy", priority: "low", progress: 30, estimatedMinutes: 150, actualMinutes: 45, revisionCounter: 0 },
    ]);
  }

  // Seed Tuition Classes
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  nextSunday.setHours(8, 0, 0, 0);

  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
  nextMonday.setHours(16, 0, 0, 0);

  const nextTuesday = new Date(now);
  nextTuesday.setDate(now.getDate() + ((9 - now.getDay()) % 7 || 7));
  nextTuesday.setHours(15, 30, 0, 0);

  const nextWednesday = new Date(now);
  nextWednesday.setDate(now.getDate() + ((10 - now.getDay()) % 7 || 7));
  nextWednesday.setHours(16, 0, 0, 0);

  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + ((12 - now.getDay()) % 7 || 7));
  nextFriday.setHours(17, 0, 0, 0);

  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + ((13 - now.getDay()) % 7 || 7));
  nextSaturday.setHours(8, 30, 0, 0);

  await db.insert(tuitionClasses).values([
    {
      subjectId: mathSubject?.id,
      teacherName: "Mr. Kapila Bandara",
      institute: "Sasip Institute - Nugegoda",
      mode: "physical",
      address: "Sasip Hall A, High Level Road, Nugegoda",
      contactNumber: "+94 77 123 4567",
      whatsapp: "+94771234567",
      classDay: "Sunday",
      classTime: "08:00 AM - 12:30 PM",
      durationMinutes: 270,
      monthlyFee: "3500.00",
      attendanceCount: 22,
      upcomingDate: nextSunday,
      homework: "Complete 2023 O/L Part II Geometry & Graphs Paper by Sunday",
      notes: "Bring Geometry Box, 4-figure Log table, and Master Maths Paper booklet",
      reminderEnabled: true,
    },
    {
      subjectId: scienceSubject?.id,
      teacherName: "Dr. Janaka Gunasekara",
      institute: "Syzygy Institute - Gampaha & Live Stream",
      mode: "hybrid",
      address: "Syzygy Main Auditorium, Yakkala Road, Gampaha",
      contactNumber: "+94 71 987 6543",
      whatsapp: "+94719876543",
      classDay: "Monday",
      classTime: "04:00 PM - 07:30 PM",
      durationMinutes: 210,
      monthlyFee: "3500.00",
      attendanceCount: 20,
      upcomingDate: nextMonday,
      homework: "Practice 15 Organic chemistry balanced reaction questions and Physics Optics ray diagram sheet",
      notes: "Download weekly PDF summary before class starts",
      reminderEnabled: true,
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "English")?.id,
      teacherName: "Mrs. Kanthi Perera",
      institute: "Sakya Institute - Nugegoda",
      mode: "physical",
      address: "Sakya Complex 2, Station Road, Nugegoda",
      contactNumber: "+94 76 555 1212",
      whatsapp: "+94765551212",
      classDay: "Tuesday",
      classTime: "03:30 PM - 06:00 PM",
      durationMinutes: 150,
      monthlyFee: "3000.00",
      attendanceCount: 18,
      upcomingDate: nextTuesday,
      homework: "Write a 200-word essay: 'The Role of Artificial Intelligence in Modern Education'",
      notes: "Bring English Past Paper Book (2018-2024)",
      reminderEnabled: true,
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Sinhala")?.id,
      teacherName: "Mr. Sarath Wijesinghe",
      institute: "Rotary - Nugegoda",
      mode: "physical",
      address: "Rotary Hall 3, Nugegoda",
      contactNumber: "+94 70 333 4455",
      whatsapp: "+94703334455",
      classDay: "Wednesday",
      classTime: "04:00 PM - 07:00 PM",
      durationMinutes: 180,
      monthlyFee: "3000.00",
      attendanceCount: 19,
      upcomingDate: nextWednesday,
      homework: "Write Sinhala essay on 'Desheeya Krushikarmaye Punarudaya' (5 pages)",
      notes: "Check Sandhi Vidhi rules tute page 45-52",
      reminderEnabled: true,
    },
    {
      subjectId: ictSubject?.id,
      teacherName: "Mr. Chamara Wickramasinghe",
      institute: "Online Tech Academy (Zoom Pro)",
      mode: "online",
      address: "Live Zoom Classroom (Meeting ID: 849 2038 9912)",
      contactNumber: "+94 78 444 8899",
      whatsapp: "+94784448899",
      classDay: "Friday",
      classTime: "05:00 PM - 08:00 PM",
      durationMinutes: 180,
      monthlyFee: "3000.00",
      attendanceCount: 21,
      upcomingDate: nextFriday,
      homework: "Write Python algorithm code for calculating student grades and test in offline IDE",
      notes: "Keep dual monitors ready for live coding drills",
      reminderEnabled: true,
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Commerce")?.id,
      teacherName: "Mr. Nimal Jayawardena",
      institute: "Rotary - Nugegoda",
      mode: "physical",
      address: "Rotary Hall 1, Nugegoda",
      contactNumber: "+94 72 222 9900",
      whatsapp: "+94722229900",
      classDay: "Saturday",
      classTime: "08:30 AM - 12:00 PM",
      durationMinutes: 210,
      monthlyFee: "3000.00",
      attendanceCount: 17,
      upcomingDate: nextSaturday,
      homework: "Prepare full Final Accounts (Trading, P&L, Balance sheet) with 8 adjustments",
      notes: "Bring 4-column accounting ledger sheets and scientific calculator",
      reminderEnabled: true,
    },
  ]);

  // Seed Daily Study Planner Sessions
  const today = new Date();
  await db.insert(studySessions).values([
    {
      subjectId: mathSubject?.id,
      title: "Morning Focus: Geometry Circle Theorem Past Paper Questions",
      slot: "morning",
      plannedMinutes: 120,
      actualMinutes: 110,
      date: today,
      completed: true,
      notes: "Completed 2019, 2021, 2023 questions. Cleared doubt on chord bisector theorem.",
    },
    {
      subjectId: scienceSubject?.id,
      title: "Afternoon Session: Electricity Circuit Calculations & Internal Resistance",
      slot: "afternoon",
      plannedMinutes: 90,
      actualMinutes: 90,
      date: today,
      completed: true,
      notes: "Solved 12 multistep numerical problems. Formula: V = E - Ir mastered.",
    },
    {
      subjectId: ictSubject?.id,
      title: "Evening Session: Flowchart Tracing & Python Loops",
      slot: "evening",
      plannedMinutes: 75,
      actualMinutes: 60,
      date: today,
      completed: false,
      notes: "Practice while loop conditionals and nested iterations.",
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "English")?.id,
      title: "Night Session: Vocabulary Drill & Formal Letter Drafting",
      slot: "night",
      plannedMinutes: 60,
      actualMinutes: 0,
      date: today,
      completed: false,
      notes: "Write formal complaint letter to municipal council regarding waste disposal.",
    },
  ]);

  // Seed Homework Items
  const dueIn2Days = new Date(today);
  dueIn2Days.setDate(today.getDate() + 2);
  const dueIn4Days = new Date(today);
  dueIn4Days.setDate(today.getDate() + 4);

  await db.insert(homeworkItems).values([
    {
      subjectId: mathSubject?.id,
      title: "Complete 2024 Colombo Educational Zone Maths Term Test Paper",
      priority: "high",
      dueDate: dueIn2Days,
      reminder: true,
      notes: "Attempt all questions in Part A (25 short questions) within 60 minutes strictly.",
      status: "pending",
    },
    {
      subjectId: scienceSubject?.id,
      title: "Draw and label Human Eye defects (Myopia & Hypermetropia) with corrective lenses",
      priority: "high",
      dueDate: dueIn2Days,
      reminder: true,
      notes: "Include ray paths and focal point shifts clearly with color pens.",
      status: "pending",
    },
    {
      subjectId: ictSubject?.id,
      title: "Create SQL DDL & DML queries for 'Library_System' database",
      priority: "medium",
      dueDate: dueIn4Days,
      reminder: true,
      notes: "Write CREATE TABLE, INSERT, SELECT with WHERE & ORDER BY clauses.",
      status: "pending",
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Sinhala")?.id,
      title: "Memorize 15 Sandhi Vidhi rules with 3 classical examples each",
      priority: "medium",
      dueDate: dueIn4Days,
      reminder: true,
      notes: "Svara sandhi, Gathakshara sandhi, Lopa sandhi rules.",
      status: "completed",
    },
  ]);

  // Seed Revision Logs for Heatmap and stats
  const revLogSeeds = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const sub = insertedSubjects[i % insertedSubjects.length];

    revLogSeeds.push({
      subjectId: sub.id,
      topic: `${sub.name} High Priority Core Revision - Batch ${i + 1}`,
      type: i % 4 === 0 ? "weak-topic" : i % 3 === 0 ? "weekly" : "daily",
      minutes: 30 + (i % 4) * 15,
      weakTopic: i % 4 === 0,
      reviewedAt: d,
      notes: `Targeted revision session on high yield topics. Flashcards reviewed.`,
    });
  }
  await db.insert(revisionLogs).values(revLogSeeds);

  // Seed Mock Exams with realistic Sri Lankan scores and mistake logs
  await db.insert(mockExams).values([
    {
      subjectId: mathSubject?.id,
      examDate: new Date(today.getTime() - 7 * 86400000),
      marks: "88.00",
      percentage: "88.00",
      grade: "A",
      timeTakenMinutes: 170,
      mistakes: "Calculation error in Question 4 (B) arithmetic progression sum formula. Missed one degree in elevation angle.",
      wrongQuestions: "Part B Q4, Part A Q19",
      weakAreas: "Speed on 3D trigonometry drawings",
      improvementNotes: "Draw larger auxiliary construction lines with 2B pencil for accuracy.",
    },
    {
      subjectId: scienceSubject?.id,
      examDate: new Date(today.getTime() - 10 * 86400000),
      marks: "91.00",
      percentage: "91.00",
      grade: "A",
      timeTakenMinutes: 175,
      mistakes: "Unit omission in acceleration (wrote m/s instead of m/s²). Lost 1 mark on kidney nephron label.",
      wrongQuestions: "Physics Part II Q2 (c), Biology Q1 (d)",
      weakAreas: "Unit consistency in SI units",
      improvementNotes: "Double-check every final answer with explicit unit checks.",
    },
    {
      subjectId: ictSubject?.id,
      examDate: new Date(today.getTime() - 14 * 86400000),
      marks: "94.00",
      percentage: "94.00",
      grade: "A",
      timeTakenMinutes: 150,
      mistakes: "One minor syntax bracket missing in Pascal repeat-until statement loop condition.",
      wrongQuestions: "Part II Q6 (b)",
      weakAreas: "Pascal loop terminating condition edge case",
      improvementNotes: "Trace loop variable bounds with a manual trace table before writing answer.",
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Sinhala")?.id,
      examDate: new Date(today.getTime() - 18 * 86400000),
      marks: "83.00",
      percentage: "83.00",
      grade: "A",
      timeTakenMinutes: 180,
      mistakes: "Spelling error in classical prose appreciation terminology (Murthi / Murtha).",
      wrongQuestions: "Sahithya Sangrahaya Part II Q3",
      weakAreas: "Akshara Vinyasa rules in long compound words",
      improvementNotes: "Practice writing 50 standard Sri Lankan Sinhala spelling list words daily.",
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Commerce")?.id,
      examDate: new Date(today.getTime() - 21 * 86400000),
      marks: "90.00",
      percentage: "90.00",
      grade: "A",
      timeTakenMinutes: 165,
      mistakes: "Minor ledger balance transfer discrepancy of LKR 500 under prepayments.",
      wrongQuestions: "Accounting Part II Q1 (Adjustments)",
      weakAreas: "Prepaid expenses vs Accrued expenses closing balance sheet transfers",
      improvementNotes: "Mark debits and credits on question paper margins before posting to T-accounts.",
    },
  ]);

  // Seed PDF & Past Papers Library
  await db.insert(pdfResources).values([
    {
      subjectId: mathSubject?.id,
      title: "G.C.E. O/L Mathematics 2024 Official Past Paper (Paper I & II)",
      type: "Past Paper",
      year: 2024,
      medium: "Sinhala & English",
      fileSize: "3.2 MB",
      bookmarked: true,
      description: "Complete Department of Examinations 2024 O/L Mathematics question paper with high resolution diagrams.",
    },
    {
      subjectId: mathSubject?.id,
      title: "G.C.E. O/L Mathematics 2024 Official Marking Scheme & Answer Guide",
      type: "Marking Schemes",
      year: 2024,
      medium: "Sinhala",
      fileSize: "2.8 MB",
      bookmarked: true,
      description: "Official mark distribution breakdown, step-by-step scoring keys, and alternative solution proofs.",
    },
    {
      subjectId: scienceSubject?.id,
      title: "G.C.E. O/L Science 2023 Past Paper with Structured Essay Analysis",
      type: "Past Paper",
      year: 2023,
      medium: "Sinhala",
      fileSize: "4.1 MB",
      bookmarked: true,
      description: "Full science examination paper covering Biology, Chemistry, and Physics modules.",
    },
    {
      subjectId: scienceSubject?.id,
      title: "O/L Science High-Yield Practical Experiment Guide (Grade 10 & 11)",
      type: "Notes",
      year: 2025,
      medium: "Sinhala",
      fileSize: "5.5 MB",
      bookmarked: true,
      description: "All compulsory school lab experiments: Preparation of gases, Electrolysis, Lenses, Biological food tests.",
    },
    {
      subjectId: ictSubject?.id,
      title: "G.C.E. O/L ICT 2024 Past Paper & Marking Scheme (Sinhala & English)",
      type: "Past Paper",
      year: 2024,
      medium: "Bilingual",
      fileSize: "2.4 MB",
      bookmarked: true,
      description: "MCQ paper with full answer key and Part II structured essay solutions with Pascal & Python code.",
    },
    {
      subjectId: ictSubject?.id,
      title: "O/L ICT Algorithm, Flowchart & Python Programming Master Notes",
      type: "Notes",
      year: 2025,
      medium: "English & Sinhala",
      fileSize: "3.8 MB",
      bookmarked: false,
      description: "Standard algorithmic paradigms, pseudocode rules, flowchart symbol standards, and 50 solved coding questions.",
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "History")?.id,
      title: "Sri Lanka O/L History Map Marking Master Atlas (100 Key Locations)",
      type: "Books",
      year: 2025,
      medium: "Sinhala",
      fileSize: "6.2 MB",
      bookmarked: true,
      description: "Annotated geographical coordinates and historical trivia for all ancient tanks, ports, kingdoms, and battlegrounds.",
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Commerce")?.id,
      title: "O/L Business & Accounting Model Paper 2026 - Western Province",
      type: "Model Paper",
      year: 2026,
      medium: "Sinhala",
      fileSize: "1.9 MB",
      bookmarked: false,
      description: "Provincial department model examination with comprehensive financial statement questions.",
    },
  ]);

  // Seed Notes
  await db.insert(notes).values([
    {
      subjectId: mathSubject?.id,
      title: "Circle Theorems Master Cheat Sheet (9 Core Proofs)",
      category: "Theory Summary",
      tags: "Maths, Geometry, Circle, Theorems, High-Yield",
      bookmarked: true,
      content: `1. Angle at the center is twice the angle at the circumference subtended by the same arc.
2. Angles in the same segment of a circle are equal.
3. Angle in a semi-circle is a right angle (90°).
4. Opposite angles of a cyclic quadrilateral sum to 180° (supplementary).
5. The tangent to a circle is perpendicular to the radius at the point of contact.
6. Tangents drawn from an external point to a circle are equal in length.
7. Alternate Segment Theorem: Angle between tangent and chord equals angle in the alternate segment.
8. Perpendicular from center to a chord bisects the chord.
9. Equal chords are equidistant from the center.`,
    },
    {
      subjectId: scienceSubject?.id,
      title: "Physics Mechanics Equations & SI Units Summary",
      category: "Formula Sheet",
      tags: "Science, Physics, Equations, Units",
      bookmarked: true,
      content: `Key Kinematics Equations:
• v = u + at
• s = ut + ½at²
• v² = u² + 2as
• s = ((u + v)/2) × t

Newton's Laws & Force:
• F = ma (Force in N, Mass in kg, Accel in m/s²)
• Momentum: p = mv (kg·m/s)
• Work Done: W = F × d (Joules, J)
• Power: P = W / t (Watts, W)
• Kinetic Energy: Ek = ½mv²
• Potential Energy: Ep = mgh (g = 10 m/s² or 9.8 m/s²)

Electricity:
• V = IR (Ohm's Law)
• P = VI = I²R = V²/R
• Electrical Energy: E = P × t = VIt`,
    },
    {
      subjectId: ictSubject?.id,
      title: "O/L ICT Number Systems & Boolean Logic Fast Reference",
      category: "Code & Logic",
      tags: "ICT, Binary, Hex, Logic Gates, SQL",
      bookmarked: true,
      content: `Binary (Base 2): 0, 1
Octal (Base 8): 0-7 (Group binary into 3 bits)
Hexadecimal (Base 16): 0-9, A(10), B(11), C(12), D(13), E(14), F(15) (Group binary into 4 bits)

Logic Gates:
• AND: Output 1 only if all inputs are 1 (Y = A . B)
• OR: Output 1 if at least one input is 1 (Y = A + B)
• NOT: Inversion of input (Y = A')
• NAND: NOT + AND (Y = (A . B)')
• NOR: NOT + OR (Y = (A + B)')
• XOR: Output 1 when inputs are different (Y = A ⊕ B)

SQL Essentials:
• SELECT column1, column2 FROM Students WHERE Mark >= 75 ORDER BY Mark DESC;
• INSERT INTO Students (ID, Name, Stream) VALUES (101, 'Chamindu', 'Commerce');
• UPDATE Students SET Mark = 95 WHERE ID = 101;
• DELETE FROM Students WHERE ID = 101;`,
    },
    {
      subjectId: insertedSubjects.find((s) => s.name === "Sinhala")?.id,
      title: "Sinhala Vyakaranaya: Akshara Vinyasaya & Sandhi Rules",
      category: "Grammar",
      tags: "Sinhala, Grammar, Sandhi, Sahithya",
      bookmarked: false,
      content: `සන්ධි ප්‍රභේද (Sandhi Classifications):
1. ස්වර සන්ධිය (Svara Sandhi):
   ගුරු + උපදේශ = ගුරූපදේශ (u + u -> ū)
   දේව + අංගනාව = දේවාංගනාව (a + a -> ā)

2. ව්‍යඤ්ජන සන්ධිය (Vyanjana Sandhi):
   අත් + පත් = අත්පත්
   නිස් + චල = නිශ්චල

3. ලෝප සන්ධිය (Lopa Sandhi):
   ස්වර ලෝපය: නෙත + ඉඳු = නෙතිඳු ('අ' ලොප් වේ)
   ව්‍යඤ්ජන ලෝපය: ගම් + හි = ගමෙහි

4. ආදේශ සන්ධිය (Aadesha Sandhi):
   අත් + සාන = අවසාන ('ත්' -> 'ව්')`,
    },
  ]);

  // Seed To-Do list items
  await db.insert(todoItems).values([
    { title: "Review Circle Theorem geometry proofs before Sunday tuition", priority: "high", recurring: "none", dueDate: dueIn2Days, completed: false },
    { title: "Draft 200-word English essay on Artificial Intelligence in Education", priority: "high", recurring: "none", dueDate: dueIn2Days, completed: false },
    { title: "Complete Science Electricity circuit numerical sheet (Q1-Q15)", priority: "high", recurring: "none", dueDate: dueIn2Days, completed: true },
    { title: "Practice ICT Pascal loop flowchart trace questions", priority: "medium", recurring: "none", dueDate: dueIn4Days, completed: false },
    { title: "Daily Morning Meditation & 10m Pomodoro Planning", priority: "medium", recurring: "daily", dueDate: today, completed: true },
    { title: "Weekly Tuition fee envelope & Attendance record reconciliation", priority: "low", recurring: "weekly", dueDate: dueIn4Days, completed: false },
  ]);
}

export async function ensureDbInitialized() {
  if (!globalForInit.__studyTrackerDbInitPromise) {
    globalForInit.__studyTrackerDbInitPromise = initialize();
  }

  await globalForInit.__studyTrackerDbInitPromise;
}
