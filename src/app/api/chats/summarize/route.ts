import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages, chats } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await req.json();

  if (!chatId) {
    return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
  }

  try {
    // ✅ Verify user owns this chat
    const chat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1);

    if (!chat || chat.length === 0 || chat[0].userId !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch all messages for this chat
    const chatMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    if (chatMessages.length === 0) {
      return NextResponse.json({ error: "No messages found" }, { status: 404 });
    }

    // Parse messages and format for summarization
    const formattedMessages = chatMessages
      .filter(m => m.content)
      .map(m => {
        const parsed = JSON.parse(m.content!);
        if (m.role === "user") {
          return `User: ${parsed.content || parsed.message || ""}`;
        } else {
          if (parsed.type === "text") {
            return `Assistant: ${parsed.content}`;
          } else if (parsed.type === "weather") {
            return `Assistant: Weather in ${parsed.city} - ${parsed.temperature}°C, ${parsed.condition}`;
          } else if (parsed.type === "stock") {
            return `Assistant: Stock ${parsed.symbol} - $${parsed.price}`;
          } else if (parsed.type === "f1") {
            return `Assistant: F1 Race - ${parsed.race} at ${parsed.location} on ${parsed.date}`;
          }
          return `Assistant: [${parsed.type}]`;
        }
      })
      .join("\n");

    // Generate summary using AI
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [
        {
          role: "user",
          content: `Please provide a concise summary of the following conversation. Focus on key topics discussed, important information shared, and any decisions or conclusions reached. Keep it brief (2-4 sentences).\n\nConversation:\n${formattedMessages}`,
        },
      ],
    });

    const summary = await result.text;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error summarizing chat:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
