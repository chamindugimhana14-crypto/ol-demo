import { asc } from "drizzle-orm";
import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import { homeworkItems } from "@/db/schema";

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  await ensureDbInitialized();
  const rows = await db.select().from(homeworkItems).orderBy(asc(homeworkItems.dueDate));
  return Response.json(rows);
}

export async function POST(request: Request) {
  await ensureDbInitialized();
  const body = (await request.json()) as Partial<typeof homeworkItems.$inferInsert>;
  const inserted = await db
    .insert(homeworkItems)
    .values({
      subjectId: body.subjectId ? toNumber(body.subjectId, 0) : null,
      title: body.title?.toString().trim() || "Homework",
      priority: body.priority?.toString() || "medium",
      dueDate: body.dueDate ? new Date(String(body.dueDate)) : null,
      reminder: Boolean(body.reminder),
      notes: body.notes?.toString() || "",
      status: body.status?.toString() || "pending",
    })
    .returning();

  return Response.json(inserted[0], { status: 201 });
}
