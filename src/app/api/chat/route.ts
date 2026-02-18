import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, userId } = await req.json();

  // Save user message
  await db.insert(messages).values({
    userId,
    role: "user",
    content: message,
  });

  // Generate AI response
  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    messages: [{ role: "user", content: message }],
  });

  const response = await result.text;

  // Save AI response
  await db.insert(messages).values({
    userId,
    role: "assistant",
    content: response,
  });

  return new Response(response);
}
