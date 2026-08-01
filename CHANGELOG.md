# Changelog

All notable changes to **Chamindu Gimhana's O/L AI Study Tracker Pro** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-01-15

### 🎉 Initial Release — Full O/L 2026 Study Management System

### Added

#### Core Infrastructure
- Next.js 16 App Router architecture with TypeScript
- PostgreSQL database via Drizzle ORM with auto-initialization
- Comprehensive Drizzle schema for 11 domain tables
- Auto-seeding of realistic Sri Lanka O/L 2026 sample data
- Server Actions for all CRUD operations
- REST API endpoints for subjects, homework, study sessions, and mock exams
- Health check endpoint with database validation

#### Executive Dashboard
- Live countdown to O/L 2026 exam (Dec 8–17, 2026)
- Sri Lanka time display (UTC+05:30)
- Study streak tracker (consecutive days)
- Daily/weekly/monthly/overall progress gauges
- Motivation quote engine
- 8-subject quick overview cards with completion bars
- Upcoming tuition schedule preview
- Pending homework alerts

#### Subject & Chapter Management (8 Subjects)
- Mathematics, Science, English, Sinhala, History, Commerce, ICT, Drama
- Full chapter checklists with status toggles (pending/in-progress/completed)
- Subject detail drawer with comprehensive editing
- +1 Revision counter per chapter
- Weak topics / strong topics tagging system
- Archive/restore functionality
- Filter by priority, difficulty, completion percentage
- Sort by name, progress, study hours

#### Tuition Class Manager
- Weekly timetable grid (Sunday–Saturday)
- Physical, Online, and Hybrid class badges
- Direct WhatsApp chat links (`wa.me/` integration)
- +1 Attendance counter
- Monthly fee total calculator (LKR)
- Teacher contact details and class notes
- Class reminder toggle

#### Daily Study Planner
- 4 structured daily sessions (Morning/Afternoon/Evening/Night)
- Planned vs actual hours tracking
- Remaining hours calculation
- Automatic "Carry Unfinished Tasks to Tomorrow"
- Subject tagging per session

#### Pomodoro Focus Pro
- Preset timers: 25m, 45m, 60m, 90m
- Custom timer input
- Break timers: 5m, 10m, 15m
- Offline singing bowl audio chime (Web Audio API)
- Confetti celebration on session completion
- Fullscreen focus mode
- Subject tagging per focus session
- Daily/weekly/monthly focus hours statistics
- localStorage persistence

#### Homework & Task Tracker
- Tuition homework queue with priority flags
- Personal study goals / daily tasks
- Priority system (High/Medium/Low)
- Recurring tasks (Daily/Weekly/None)
- Check-off with confetti celebration
- Re-open completed items
- Due date tracking

#### Smart Revision System
- Daily/Weekly/Monthly revision cycles
- Random Revision Topic Generator (anti-procrastination wheel)
- Weak topic priority queue
- 84-day activity heatmap grid
- Revision log with subject, topic, type, and minutes

#### Mock Exams & Grade Predictor
- Sri Lanka O/L grading (A≥75, B≥65, C≥50, S≥35, W<35)
- Marks, percentage, grade auto-calculator
- Time taken tracker
- Mistake Journal (wrong questions, lost marks)
- Weak areas analysis
- Improvement action notes

#### Past Papers & PDF Library
- Pre-loaded Sri Lanka Department of Examinations papers
- 2018–2026 Past Papers, Model Papers, Marking Schemes
- Filter by year, subject, medium, type
- Simulated PDF previewer
- Download simulation
- Bookmark system

#### Study Notes & Theory Vault
- Markdown/text note editor
- Tags and categories
- Bookmark system
- Content search
- Pre-seeded formula sheets and theory summaries

#### Analytics & Reports
- Subject study hours vs target comparison
- Visual progress bars per subject
- Printable Academic Report (`window.print()`)
- CSV/Excel Export (1-click download)
- Multiple report types

#### Global Search
- `Cmd + K` / `Ctrl + K` keyboard shortcut
- Real-time search across all 8 entity types
- Jump to relevant tab on selection

#### Settings & Offline Backup
- Dark/Light theme toggle
- Accent color customization
- Audio chime toggle
- Auto-save toggle
- Keyboard shortcuts toggle
- 1-click JSON backup save (full database snapshot)
- 1-click restore from last backup
- 1-click "Reset Sample O/L Data"

#### UI/UX
- Premium black-and-gold Apple-quality theme
- Matte black background (`#0A0A0A`)
- Gold accent color (`#FFD700`)
- Glassmorphism-style card surfaces
- Rounded corners and soft shadows
- Responsive layout (Desktop, Laptop, Tablet, Mobile)
- Smooth page transitions with Tailwind animations
- Lucide React icon library integration

---

## [Unreleased]

### Planned
- Interactive study calendar (daily/weekly/monthly views)
- Rich text editor for notes (WYSIWYG)
- PDF file upload and actual storage
- Audio study session recording
- Study group collaboration features
- Mobile PWA (Progressive Web App) support
- Push notifications for tuition reminders
- AI-powered study plan recommendations
- Charts library integration (line, bar, pie, radar)
- Export reports as actual PDF files (not just print)
- Import data from Excel/CSV
- Multi-language support (Sinhala, Tamil, English)
