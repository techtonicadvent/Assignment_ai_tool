import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages, chats } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getWeather } from "@/lib/weather";
import { getStock } from "@/lib/stock";
import { getNextRace } from "@/lib/f1";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, chatId } = await req.json();

  if (!chatId) {
    return Response.json({ error: "Missing chatId" });
  }

  // ✅ Verify user owns this chat
  const chat = await db
    .select()
    .from(chats)
    .where(eq(chats.id, chatId))
    .limit(1);

  if (!chat || chat.length === 0 || chat[0].userId !== session.user.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ SAVE USER MESSAGE FIRST
  await db.insert(messages).values({
    chatId,
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: message,
      user: true,
    }),
  });

  let response: any;
  const lower = message.toLowerCase();

  // ✅ SMART TOOL ROUTING
  if (lower.includes("weather")) {
    const city = message.replace(/weather|in/gi, "").trim();
    response = await getWeather(city || "Bangalore");

  } else if (lower.includes("stock")) {
    const symbol = message.replace(/stock/gi, "").trim();
    response = await getStock(symbol || "AAPL");

  } else if (lower.includes("f1") || lower.includes("race")) {
    response = await getNextRace();

  } else {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{ role: "user", content: message }],
    });

    response = {
      type: "text",
      content: await result.text,
    };
  }

  // ✅ SAVE AI MESSAGE
  await db.insert(messages).values({
    chatId,
    role: "assistant",
    content: JSON.stringify(response),
  });

  return Response.json(response);
}
