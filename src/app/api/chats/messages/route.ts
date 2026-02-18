import { db } from "@/lib/db";
import { messages, chats } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatIdParam = searchParams.get("chatId");

  if (!chatIdParam) {
    return NextResponse.json([]);
  }

  const chatId: string = chatIdParam;

  // ✅ Verify user owns this chat
  const chat = await db
    .select()
    .from(chats)
    .where(eq(chats.id, chatId))
    .limit(1);

  if (!chat || chat.length === 0 || chat[0].userId !== session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
