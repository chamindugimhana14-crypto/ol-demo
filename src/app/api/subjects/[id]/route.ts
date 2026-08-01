import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import { subjects } from "@/db/schema";

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureDbInitialized();
  const { id } = await params;
  const subjectId = Number(id);
  if (!Number.isFinite(subjectId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await request.json()) as Partial<typeof subjects.$inferInsert>;
  const updated = await db
    .update(subjects)
    .set({
      name: body.name?.toString().trim() || undefined,
      teacher: body.teacher?.toString(),
      tuitionInstitute: body.tuitionInstitute?.toString(),
      priority: body.priority?.toString(),
      difficulty: body.difficulty?.toString(),
      completedChapters: body.completedChapters === undefined ? undefined : toNumber(body.completedChapters, 0),
      totalChapters: body.totalChapters === undefined ? undefined : toNumber(body.totalChapters, 0),
      actualStudyHours: body.actualStudyHours === undefined ? undefined : String(toNumber(body.actualStudyHours, 0)),
      revisionCount: body.revisionCount === undefined ? undefined : toNumber(body.revisionCount, 0),
      mockExamAverage: body.mockExamAverage === undefined ? undefined : String(toNumber(body.mockExamAverage, 0)),
      archived: body.archived,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, subjectId))
    .returning();

  if (!updated[0]) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(updated[0]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureDbInitialized();
  const { id } = await params;
  const subjectId = Number(id);
  if (!Number.isFinite(subjectId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const deleted = await db.delete(subjects).where(eq(subjects.id, subjectId)).returning();
  if (!deleted[0]) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
