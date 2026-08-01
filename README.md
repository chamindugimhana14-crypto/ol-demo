<div align="center">

# 📚 Chamindu Gimhana's O/L AI Study Tracker Pro

### Premium Black & Gold Offline Study Management System

**Sri Lanka G.C.E. Ordinary Level Examination 2026 — Private Candidate Edition**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Drizzle ORM](https://img.shields.io/C5-EF76?style=for-the-badge&logo=data&logoColor=white)
![PostgreSQL](https://img.shields.io/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)

---

*A complete, fully-offline, production-grade study management system built for an independent private candidate preparing for the Sri Lanka G.C.E. Ordinary Level Examination 2026.*

**🎯 Goal: 9A Distinction (Island Rank Contender)**

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🧠 About

**Chamindu Gimhana's O/L AI Study Tracker Pro** is a premium, fully-featured, offline-capable study management platform designed specifically for Sri Lankan private candidates preparing for the G.C.E. Ordinary Level examination.

Built with a **black-and-gold Apple-quality UI**, the application provides:

- 🎯 A unified dashboard for all 8 O/L subjects
- ⏱️ A Pomodoro Focus Timer with offline audio chimes
- 📅 A structured daily 4-slot study planner (Morning, Afternoon, Evening, Night)
- 🎓 A complete tuition class timetable manager with WhatsApp integration
- 📖 A past papers & marking scheme PDF library
- 📊 Analytics, grade prediction, and printable academic reports
- 💾 100% offline data persistence via local PostgreSQL + Drizzle ORM

**Exam Schedule:** December 8–17, 2026

**Candidate Type:** Private (Independent Study + Tuition Classes)

---

## ✨ Key Features

### 📊 Executive Dashboard
- Live countdown to O/L 2026 (Days, Hours, Minutes, Seconds)
- Current Sri Lanka time (UTC+05:30)
- Study streak tracker (consecutive days)
- Daily/weekly/monthly/overall progress gauges
- Motivation quote engine
- Quick subject overview cards

### 📚 Subject & Chapter Management
- All 8 O/L subjects with full chapter breakdowns
- Subject detail drawer with chapter checklist
- One-click revision counter (+1 Revision)
- Weak topics / strong topics tagging
- Archive/restore system
- Filter by priority, difficulty, completion %
- Real Sri Lankan curriculum chapters pre-seeded

**Subjects:**
| Subject | Icon | Priority |
|---------|------|----------|
| Mathematics | 📐 | High |
| Science | 🔬 | High |
| English | 🇬🇧 | High |
| Sinhala | 📖 | High |
| History | 🏛️ | Medium |
| Commerce | 💼 | Medium |
| ICT | 💻 | High |
| Drama | 🎭 | Medium |

### 🎓 Tuition Class Manager
- Weekly timetable grid (Sunday–Saturday)
- Teacher name, institute, contact details
- Online / Physical / Hybrid class badges
- Direct WhatsApp chat button (`wa.me/` links)
- +1 attendance counter
- Monthly fee total calculator (LKR)
- Class notes & homework assignments

### 📅 Daily Study Planner
- 4 structured daily sessions:
  - 🌅 **Morning:** 05:00 AM – 08:00 AM
  - ☀️ **Afternoon:** 02:00 PM – 05:00 PM
  - 🌇 **Evening:** 05:30 PM – 08:30 PM
  - 🌙 **Night:** 09:00 PM – 11:30 PM
- Planned vs actual hours tracking
- Remaining hours calculation
- Automatic "Carry Unfinished Tasks to Tomorrow"
- Completion percentage per slot

### ⏱️ Pomodoro Focus Pro
- Preset timers: 25m, 45m, 60m, 90m
- Custom timer (any duration)
- Break timer (5m, 10m, 15m)
- **Offline singing bowl audio chime** (Web Audio API — zero network requests)
- Confetti celebration on session completion
- Fullscreen focus mode
- Subject tagging per session
- Daily/weekly/monthly focus hours stats
- Local localStorage persistence

### 📝 Homework & Task Tracker
- Tuition homework queue with due dates
- Personal study goals / daily tasks
- Priority flags (High/Medium/Low)
- Recurring tasks (Daily/Weekly/None)
- Check-off with confetti celebration
- Re-open completed items

### 🔄 Smart Revision System
- Daily / Weekly / Monthly revision cycles
- **Random Revision Topic Generator** (anti-procrastination wheel)
- Weak topic priority queue
- 84-day activity heatmap grid
- Revision log with subject, topic, type, and minutes

### 🎯 Mock Exams & 9A Grade Predictor
- Sri Lanka O/L grading system:
  - **A** ≥ 75% | **B** ≥ 65% | **C** ≥ 50% | **S** ≥ 35% | **W** < 35%
- Marks, percentage, grade auto-calculator
- Time taken tracker
- **Mistake Journal** (wrong questions, lost marks)
- Weak areas analysis
- Improvement action notes
- Subject-wise mock exam filtering

### 📖 Past Papers & PDF Library
- Official Sri Lanka Department of Examinations papers
- 2018–2026 Past Papers, Model Papers, Marking Schemes
- Filter by year, subject, medium (Sinhala/English), type
- Simulated PDF previewer
- Download simulation
- Bookmark system
- Search across all resources

### 📝 Study Notes & Theory Vault
- Markdown/text note editor
- Tags and categories
- Bookmark system
- Subject filtering
- Content search
- Pre-seeded formula sheets & theory summaries

### 📈 Analytics & Reports
- Subject study hours vs target comparison
- Visual progress bars per subject
- **Printable Academic Report** (`window.print()` → PDF)
- **CSV/Excel Export** (1-click download)
- Report types: Executive Summary, Mock Exam Analytics, Tuition Ledger, Revision Log

### 🔍 Instant Global Search (`Cmd + K`)
- Real-time search across ALL entities:
  - Subjects, Chapters, Tuition Classes
  - Homework, Notes, Past Papers, Tasks
- Keyboard shortcut: `Cmd + K` or `Ctrl + K`
- Jump to relevant tab on selection

### ⚙️ Settings & Offline Backup
- Dark/Light theme toggle
- Accent color picker
- Audio chime toggle
- Auto-save toggle
- Keyboard shortcuts toggle
- **1-click JSON backup save** (full database snapshot)
- **1-click restore** from last backup
- **1-click "Reset Sample O/L Data"** (reload all 8 subjects, timetable, papers)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js (App Router) | 16.2.6 | Full-stack React framework |
| React | 19.2.6 | UI component library |
| TypeScript | 5.9.3 | Type-safe development |
| Tailwind CSS | 4.1.17 | Utility-first styling |
| Lucide React | 1.x | Icon library |
| Canvas Confetti | 1.x | Celebration animations |
| Web Audio API | Native | Offline sound effects |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Server runtime |
| Drizzle ORM | 0.45.2 | Type-safe database ORM |
| PostgreSQL | 14+ | Primary database |
| pg (node-postgres) | 8.x | PostgreSQL driver |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code quality linting |
| Drizzle Kit | Schema management & migrations |
| TypeScript Compiler | Type checking |

---

## 📦 Installation

### Prerequisites

- **Node.js** 18 or later
- **PostgreSQL** 14 or later (local or remote)
- **npm** 9+ (or yarn/pnpm)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Chamindu-OL-AI-Study-Tracker-Pro.git
cd Chamindu-OL-AI-Study-Tracker-Pro
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

### Step 4: Create the Database

```bash
# Using psql CLI
psql -U postgres -c "CREATE DATABASE app_db;"
```

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Production Build

```bash
npm run build
npm start
```

---

## 🗄️ Database Setup

This project uses **Drizzle ORM** with **PostgreSQL**. All database tables are auto-created at runtime via the initialization script (`src/db/init.ts`).

### Tables

| Table | Description |
|-------|-------------|
| `subjects` | 8 O/L examination subjects |
| `chapters` | Syllabus chapters per subject |
| `tuition_classes` | Tuition timetable & teacher details |
| `study_sessions` | Daily planner study sessions |
| `homework_items` | Tuition homework assignments |
| `revision_logs` | Revision history & heatmap data |
| `mock_exams` | Mock exam results & mistake journal |
| `notes` | Study notes & formula sheets |
| `pdf_resources` | Past papers & marking schemes |
| `todo_items` | Personal study goals & tasks |
| `app_settings` | Application preferences |

### Auto-Seeding

On first run, the database is automatically populated with:
- 8 realistic O/L subjects with Sri Lankan curriculum chapters
- Tuition class timetable (Sunday–Saturday)
- Study planner sessions
- Revision history (28-day heatmap)
- Mock exam results with mistake journal
- Past papers & marking scheme references
- Formula sheets & theory notes
- Daily study goals

### Manual Schema Push (Optional)

```bash
npx drizzle-kit push
```

---

## 📖 Usage Guide

### Navigation

The application features **12 integrated workspace tabs**:

1. **Dashboard** — Executive overview with countdown, KPIs, and quick actions
2. **Subjects** — 8-subject mastery hub with chapter checklists
3. **Tuition** — Weekly timetable with WhatsApp & attendance
4. **Planner** — 4-slot daily study execution matrix
5. **Pomodoro** — Focus timer with offline audio chimes
6. **Homework** — Assignment queue & daily task tracker
7. **Revision** — Smart revision generator & heatmap
8. **Mock Exams** — Grade predictor & mistake journal
9. **Past Papers** — PDF library with year/subject filters
10. **Notes** — Theory vault & formula sheets
11. **Analytics** — Visual comparison & printable reports
12. **Settings** — Theme, backup, restore & preferences

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd + K` / `Ctrl + K` | Open global search |
| `Escape` | Close modals & overlays |

### Backup & Restore

- **Save Backup:** Settings → "Save Local Backup JSON" (downloads full database snapshot)
- **Restore Backup:** Settings → "Restore Last Saved Backup"
- **Reset Data:** Settings → "Reset & Reload Sri Lanka O/L 2026 Sample Data"

---

## 📁 Project Structure

```
Chamindu-OL-AI-Study-Tracker-Pro/
├── public/                          # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts      # Health check endpoint
│   │   │   ├── homework/route.ts    # Homework REST API
│   │   │   ├── mock-exams/route.ts  # Mock exams REST API
│   │   │   ├── study-sessions/
│   │   │   │   route.ts             # Study sessions REST API
│   │   │   └── subjects/
│   │   │       route.ts             # Subjects CRUD REST API
│   │   │       [id]/route.ts        # Single subject REST API
│   │   ├── actions.ts               # Server actions (all CRUD operations)
│   │   ├── globals.css              # Global styles & theme tokens
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Homepage entry point
│   ├── components/
│   │   ├── CountdownClock.tsx        # Live O/L 2026 countdown timer
│   │   ├── DailyStudyPlanner.tsx     # 4-slot daily study planner
│   │   ├── ExportReportsModal.tsx    # PDF/CSV report generator
│   │   ├── GlobalSearchModal.tsx     # Cmd+K instant search
│   │   ├── HomeworkAndTasksModule.tsx # Homework & task tracker
│   │   ├── MainStudyHub.tsx          # Main workspace (12-tab hub)
│   │   ├── MockExamsModule.tsx       # Mock exams & grade analytics
│   │   ├── NotesAndDocsModule.tsx    # Study notes & theory vault
│   │   ├── PdfViewerModal.tsx        # Past papers PDF library
│   │   ├── PomodoroTimer.tsx         # Focus timer with audio
│   │   ├── SmartRevisionGenerator.tsx # Revision system & heatmap
│   │   ├── SoundEffects.ts           # Web Audio API chime generator
│   │   ├── SubjectDetailDrawer.tsx   # Subject detail overlay
│   │   ├── ThemeController.tsx       # Dark/light theme controller
│   │   └── TuitionTimetableGrid.tsx  # Tuition timetable & fees
│   └── db/
│       ├── index.ts                  # Database connection pool
│       ├── init.ts                   # Auto-table creation & data seeder
│       └── schema.ts                 # Drizzle ORM schema definitions
├── .env.example                      # Environment variable template
├── .gitignore                        # Git ignore rules
├── CHANGELOG.md                      # Version history
├── CONTRIBUTING.md                   # Contribution guidelines
├── LICENSE                           # MIT License
├── README.md                         # This file
├── drizzle.config.json               # Drizzle Kit configuration
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
├── postcss.config.mjs                # PostCSS configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## 🔌 API Reference

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check (DB status) |
| `GET` | `/api/subjects` | List all subjects (filter: `?q=`, `?archived=`) |
| `POST` | `/api/subjects` | Create a new subject |
| `PATCH` | `/api/subjects/[id]` | Update a subject |
| `DELETE` | `/api/subjects/[id]` | Delete a subject |
| `GET` | `/api/homework` | List all homework items |
| `POST` | `/api/homework` | Create homework |
| `GET` | `/api/study-sessions` | List all study sessions |
| `POST` | `/api/study-sessions` | Create study session |
| `GET` | `/api/mock-exams` | List all mock exam results |
| `POST` | `/api/mock-exams` | Create mock exam entry |

### Server Actions

All CRUD operations are handled via Next.js Server Actions in `src/app/actions.ts`. Key actions include:

- Subject: `createSubject`, `updateSubject`, `deleteSubject`, `archiveSubject`, `restoreSubject`
- Chapter: `createChapter`, `updateChapter`, `deleteChapter`, `incrementChapterRevision`
- Tuition: `createTuitionClass`, `markTuitionAttendance`, `deleteTuitionClass`
- Planner: `createStudySession`, `completeStudySession`, `carryForwardMissedSessions`
- Homework: `createHomework`, `completeHomework`, `reopenHomework`, `deleteHomework`
- Revision: `createRevisionLog`, `deleteRevisionLog`
- Mock Exam: `createMockExam`, `deleteMockExam`
- Notes: `createNote`, `updateNote`, `toggleBookmarkNote`, `deleteNote`
- PDF: `createPdfResource`, `toggleBookmarkPdf`, `deletePdfResource`
- Tasks: `createTodo`, `toggleTodo`, `deleteTodo`
- Settings: `updateSettings`, `saveBackup`, `restoreBackup`, `resetToDefaultSeedData`
- Dashboard: `getDashboardData`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |

### Theme

The application defaults to a **Premium Black & Gold** dark theme. Users can switch to light mode via Settings. The accent color is customizable (default: `#FFD700`).

---

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Chamindu Gimhana**

- 🇱🇰 Sri Lanka
- 🎓 Private Candidate — G.C.E. Ordinary Level 2026
- 📧 GitHub: [@chamindugimhana](https://github.com/chamindugimhana)

---

<div align="center">

### 🏆 Target: 9A Distinction — G.C.E. O/L 2026

*Built with dedication, discipline, and the will to succeed.*

**⭐ Star this repository if you find it helpful!**

</div>
