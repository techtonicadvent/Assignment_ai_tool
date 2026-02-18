import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { getWeather } from "@/lib/weather";
import { getStock } from "@/lib/stock";
import { getNextRace } from "@/lib/f1";

export async function POST(req: Request) {
  const { message, userId } = await req.json();

  await db.insert(messages).values({
    userId,
    role: "user",
    content: message,
  });

  const lower = message.toLowerCase();
  let response: any;

  if (lower.startsWith("weather")) {
    const city = message.replace(/weather/i, "").trim() || "Bangalore";
    response = await getWeather(city);

  } else if (lower.startsWith("stock")) {
    const symbol = message.replace(/stock/i, "").trim() || "AAPL";
    response = await getStock(symbol);

  } else if (lower.includes("next f1") || lower.includes("next race")) {
    response = await getNextRace();

  } else {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{ role: "user", content: message }],
    });

    const text = await result.text;
    response = { type: "text", content: text };
  }

  await db.insert(messages).values({
    userId,
    role: "assistant",
    content: JSON.stringify(response),
  });

  return Response.json(response);
}
