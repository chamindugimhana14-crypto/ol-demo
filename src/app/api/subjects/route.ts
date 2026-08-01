import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import { subjects } from "@/db/schema";

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(request: Request) {
  await ensureDbInitialized();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const archived = searchParams.get("archived") ?? "active";

  const clauses = [] as ReturnType<typeof eq>[];
  if (archived === "active") clauses.push(eq(subjects.archived, false));
  if (archived === "archived") clauses.push(eq(subjects.archived, true));
  if (q) clauses.push(ilike(subjects.name, `%${q}%`));

  const whereClause = clauses.length
    ? clauses.slice(1).reduce((a, b) => and(a, b) as NonNullable<typeof a>, clauses[0])
    : undefined;

  const rows = whereClause
    ? await db.select().from(subjects).where(whereClause).orderBy(asc(subjects.name))
    : await db.select().from(subjects).orderBy(asc(subjects.name));

  return Response.json(rows);
}

export async function POST(request: Request) {
  await ensureDbInitialized();
  const body = (await request.json()) as Partial<typeof subjects.$inferInsert>;

  const inserted = await db
    .insert(subjects)
    .values({
      name: body.name?.toString().trim() || "Untitled Subject",
      color: body.color?.toString() || "#FFD700",
      icon: body.icon?.toString() || "📘",
      teacher: body.teacher?.toString() || "",
      tuitionInstitute: body.tuitionInstitute?.toString() || "",
      priority: body.priority?.toString() || "medium",
      difficulty: body.difficulty?.toString() || "medium",
      totalChapters: toNumber(body.totalChapters, 0),
      completedChapters: toNumber(body.completedChapters, 0),
      estimatedStudyHours: String(toNumber(body.estimatedStudyHours, 0)),
      actualStudyHours: String(toNumber(body.actualStudyHours, 0)),
      notes: body.notes?.toString() || "",
      resources: body.resources?.toString() || "",
      weakTopics: body.weakTopics?.toString() || "",
      strongTopics: body.strongTopics?.toString() || "",
    })
    .returning();

  return Response.json(inserted[0], { status: 201 });
}
