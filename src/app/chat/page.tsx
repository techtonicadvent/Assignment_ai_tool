"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { type: "text", content: input, user: true }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input,
        userId: session?.user?.email,
      }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, data]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl space-y-4">

        {messages.map((m, i) => {
          if (m.type === "weather") {
            return (
              <div key={i} className="rounded-xl bg-white p-4 shadow">
                <div className="text-sm text-gray-500">Weather</div>
                <div className="text-lg font-semibold">{m.city}</div>
                <div className="text-3xl">{m.temperature}°C</div>
                <div className="text-gray-600">{m.condition}</div>
              </div>
            );
          }

          if (m.type === "stock") {
            return (
              <div key={i} className="rounded-xl bg-white p-4 shadow">
                <div className="text-sm text-gray-500">Stock Price</div>
                <div className="text-lg font-semibold">{m.symbol}</div>
                <div className="text-3xl">${m.price}</div>
              </div>
            );
          }

          if (m.type === "f1") {
            return (
              <div key={i} className="rounded-xl bg-white p-4 shadow">
                <div className="text-sm text-gray-500">Next F1 Race</div>
                <div className="text-lg font-semibold">{m.race}</div>
                <div className="text-gray-600">{m.location}</div>
                <div className="text-gray-500">{m.date}</div>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`rounded p-3 ${
                m.user ? "ml-auto bg-black text-white" : "bg-white shadow"
              }`}
            >
              {m.content}
            </div>
          );
        })}

        <div className="flex gap-2 pt-4">
          <input
            className="flex-1 rounded border p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
          />
          <button
            onClick={sendMessage}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
