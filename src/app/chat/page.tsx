"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, `You: ${input}`]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let aiText = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value);
        setMessages((prev) => [...prev.slice(0, -1), `AI: ${aiText}`]);
      }
    }

    setInput("");
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <div className="mb-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="rounded bg-gray-100 p-2">
            {m}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
