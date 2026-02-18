import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(messages).orderBy(messages.createdAt);

  return NextResponse.json(
    data.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`)
  );
}
