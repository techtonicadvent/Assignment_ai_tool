import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  return result.toTextStreamResponse();
}
