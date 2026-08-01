import { desc } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import { mockExams } from "@/db/schema";

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  await ensureDbInitialized();
  const rows = await db.select().from(mockExams).orderBy(desc(mockExams.examDate));
  return Response.json(rows);
}

export async function POST(request: Request) {
  await ensureDbInitialized();
  const body = (await request.json()) as Partial<typeof mockExams.$inferInsert> & { total?: number };
  const marks = toNumber(body.marks, 0);
  const total = toNumber(body.total, 100) || 100;
  const percentage = ((marks / total) * 100).toFixed(2);

  const inserted = await db
    .insert(mockExams)
    .values({
      subjectId: body.subjectId ? toNumber(body.subjectId, 0) : null,
      examDate: body.examDate ? new Date(String(body.examDate)) : new Date(),
      marks: String(marks),
      percentage,
      grade: body.grade?.toString() || "N/A",
      timeTakenMinutes: toNumber(body.timeTakenMinutes, 0),
      mistakes: body.mistakes?.toString() || "",
      wrongQuestions: body.wrongQuestions?.toString() || "",
      weakAreas: body.weakAreas?.toString() || "",
      improvementNotes: body.improvementNotes?.toString() || "",
    })
    .returning();

  return Response.json(inserted[0], { status: 201 });
}
