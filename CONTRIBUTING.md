# Contributing to Chamindu Gimhana's O/L AI Study Tracker Pro

Thank you for your interest in contributing! This guide will help you get started.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm 9+
- Git

### Setup

1. **Fork** the repository on GitHub

2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Chamindu-OL-AI-Study-Tracker-Pro.git
   cd Chamindu-OL-AI-Study-Tracker-Pro
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

5. **Create database:**
   ```bash
   psql -U postgres -c "CREATE DATABASE app_db;"
   ```

6. **Start development:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run type checking:
   ```bash
   npm run typecheck
   ```

4. Run the build:
   ```bash
   npm run build
   ```

5. Commit your changes (see [Commit Guidelines](#commit-guidelines))

6. Push to your fork and open a Pull Request

---

## Code Standards

### TypeScript

- All code must be written in **TypeScript**
- Use strict mode (`"strict": true` in tsconfig)
- Avoid `any` types — use proper type annotations
- Export types alongside functions when relevant

### React / Next.js

- Use **Server Components** by default
- Only add `"use client"` when the component requires interactivity (hooks, event handlers, browser APIs)
- Use **Server Actions** for mutations (in `src/app/actions.ts`)
- Prefer `async/await` over `.then()` chains

### Styling

- Use **Tailwind CSS** utility classes
- Follow the existing black-and-gold theme
- Use `bg-[#0A0A0A]` for dark backgrounds, `#FFD700` for gold accents
- Use rounded corners (`rounded-2xl`) and subtle borders (`border-zinc-800`)

### File Naming

- Components: `PascalCase.tsx` (e.g., `PomodoroTimer.tsx`)
- Utilities: `camelCase.ts` (e.g., `soundEffects.ts`)
- API routes: `route.ts` inside folder structure
- Server actions: `actions.ts`

### Database

- Use Drizzle ORM for all database queries
- Define schemas in `src/db/schema.ts`
- Use raw SQL via `sql` template literals only for table creation in `src/db/init.ts`

---

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring without changing functionality |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, CI config |

### Examples

```
feat(pomodoro): add fullscreen focus mode with audio toggle
fix(homework): correct due date sorting for past dates
docs(readme): update installation instructions
refactor(actions): consolidate subject CRUD operations
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run `npm run typecheck` — **zero errors required**
3. Run `npm run build` — **must pass**
4. Write a clear PR description explaining:
   - What changed
   - Why it changed
   - How to test it
5. Reference any related issues (e.g., `Fixes #42`)
6. Request review from the maintainer

### PR Title Format

```
<type>(<scope>): <short description>
```

---

## Bug Reports

When reporting bugs, please include:

1. **Steps to reproduce** the issue
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots** (if applicable)
5. **Environment details:**
   - OS (Windows/macOS/Linux)
   - Node.js version
   - Browser and version
   - PostgreSQL version

---

## Feature Requests

Feature requests are welcome! Please include:

1. **Problem description** — what problem does this solve?
2. **Proposed solution** — how should it work?
3. **Alternatives considered** — what other approaches did you think about?
4. **Additional context** — mockups, examples, references

---

## Questions?

Open a [GitHub Discussion](https://github.com/yourusername/Chamindu-OL-AI-Study-Tracker-Pro/discussions) if you have questions about contributing.

---

**Thank you for helping make O/L exam preparation better for Sri Lankan students! 🇱🇰**
