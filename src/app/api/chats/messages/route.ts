import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatIdParam = searchParams.get("chatId");

  if (!chatIdParam) {
    return NextResponse.json([]);
  }

  const chatId: string = chatIdParam;

  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);

  const parsed = data
    .filter(m => m.content)
    .map(m => JSON.parse(m.content!));

  return NextResponse.json(parsed);
}
