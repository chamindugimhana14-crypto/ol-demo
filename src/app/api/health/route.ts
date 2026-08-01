import { db } from "@/db";
import { ensureDbInitialized } from "@/db/init";
import { subjects } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDbInitialized();
    await db.select({ id: subjects.id }).from(subjects).limit(1);
    return Response.json({ ok: true, db: "ready" });
  } catch {
    return Response.json({ ok: false, db: "error" }, { status: 500 });
  }
}
