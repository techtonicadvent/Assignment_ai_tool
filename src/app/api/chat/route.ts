import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { getWeather } from "@/lib/weather";
import { getStock } from "@/lib/stock";
import { getNextRace } from "@/lib/f1";

export async function POST(req: Request) {
  const { message, chatId } = await req.json();

  if (!chatId) {
    return Response.json({ error: "Missing chatId" });
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
