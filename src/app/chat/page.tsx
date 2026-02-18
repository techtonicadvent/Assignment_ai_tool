"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const res = await fetch("/api/history");
      const data = await res.json();
      setMessages(data);
    };
    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, `You: ${input}`]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        userId: session?.user?.email,
      }),
    });

    const reply = await res.text();
    setMessages((prev) => [...prev, `AI: ${reply}`]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">AI Chat</h1>

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
          placeholder="Ask something..."
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
