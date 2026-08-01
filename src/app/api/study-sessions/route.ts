import { desc } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import { studySessions } from "@/db/schema";

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  await ensureDbInitialized();
  const rows = await db.select().from(studySessions).orderBy(desc(studySessions.date));
  return Response.json(rows);
}

export async function POST(request: Request) {
  await ensureDbInitialized();
  const body = (await request.json()) as Partial<typeof studySessions.$inferInsert>;
  const inserted = await db
    .insert(studySessions)
    .values({
      subjectId: body.subjectId ? toNumber(body.subjectId, 0) : null,
      title: body.title?.toString().trim() || "Study Session",
      slot: body.slot?.toString() || "morning",
      plannedMinutes: toNumber(body.plannedMinutes, 60),
      actualMinutes: toNumber(body.actualMinutes, 0),
      date: body.date ? new Date(String(body.date)) : new Date(),
      completed: Boolean(body.completed),
      notes: body.notes?.toString() || "",
    })
    .returning();

  return Response.json(inserted[0], { status: 201 });
}
