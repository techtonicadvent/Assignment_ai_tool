import { db } from "@/lib/db";
import { messages, chats } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all chat IDs for the current user
  const userChats = await db
    .select({ id: chats.id })
    .from(chats)
    .where(eq(chats.userId, session.user.email));

  if (userChats.length === 0) {
    return NextResponse.json([]);
  }

  const chatIds = userChats.map((c) => c.id);

  const data = await db
    .select()
    .from(messages)
    .where(inArray(messages.chatId, chatIds))
    .orderBy(messages.createdAt);

  return NextResponse.json(
    data.map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.content}`)
  );
}
