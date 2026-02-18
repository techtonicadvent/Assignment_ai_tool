import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { getWeather } from "@/lib/weather";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, userId } = await req.json();

  // Save user message
  await db.insert(messages).values({
    userId,
    role: "user",
    content: message,
  });

  let responseText = "";

  // Simple tool detection
  if (message.toLowerCase().includes("weather")) {
    const words = message.split(" ");
    const city = words[words.length - 1] || "Bangalore";
    responseText = await getWeather(city);
  } else {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [{ role: "user", content: message }],
    });

    responseText = await result.text;
  }

  // Save AI response
  await db.insert(messages).values({
    userId,
    role: "assistant",
    content: responseText,
  });

  return new Response(responseText);
}
