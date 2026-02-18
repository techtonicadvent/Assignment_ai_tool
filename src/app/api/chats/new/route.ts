import { db } from "@/lib/db";
import { chats } from "@/lib/schema";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, firstMessage } = await req.json();

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
