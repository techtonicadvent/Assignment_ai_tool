import { db } from "@/lib/db";
import { chats } from "@/lib/schema";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstMessage } = await req.json();
  const userId = session.user.email;

  let title = "New Chat";

  if (firstMessage) {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [
        { role: "user", content: `Give a 3-5 word title for: ${firstMessage}` },
      ],
    });

    title = (await result.text).replace(/["\n]/g, "");
  }

  const [chat] = await db
    .insert(chats)
    .values({ userId, title })
    .returning();

  return NextResponse.json(chat);
}
