import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { getWeather } from "@/lib/weather";
import { getStock } from "@/lib/stock";
import { getNextRace } from "@/lib/f1";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, userId } = await req.json();

  await db.insert(messages).values({
    userId,
    role: "user",
    content: message,
  });

  let responseText = "";

  const lower = message.toLowerCase();

  if (lower.includes("weather")) {
    const city = message.replace(/weather/i, "").trim() || "Bangalore";
    responseText = await getWeather(city);
  } else if (lower.includes("stock")) {
    const symbol = message.replace(/stock/i, "").trim() || "AAPL";
    responseText = await getStock(symbol);
  } else if (lower.includes("f1") || lower.includes("race")) {
    responseText = await getNextRace();
  } else {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{ role: "user", content: message }],
    });

    responseText = await result.text;
  }

  await db.insert(messages).values({
    userId,
    role: "assistant",
    content: responseText,
  });

  return new Response(responseText);
}
