"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";

export default function ChatPage() {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);

  const loadMessages = async (id: string) => {
    const res = await fetch(`/api/chats/messages?chatId=${id}`);
    const data = await res.json();
    setMessages(data);
    setChatId(id);
  };

  const createChat = async (firstMsg: string) => {
    const res = await fetch("/api/chats/new", {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user?.email,
        firstMessage: firstMsg,
      }),
    });

    const chat = await res.json();
    setChatId(chat.id);
    return chat.id;
  };

  const sendMessage = async () => {
    if (!input) return;

    let id = chatId;
    if (!id) id = await createChat(input);

    setMessages(prev => [
      ...prev,
      { type: "text", content: input, user: true },
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input, chatId: id }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, data]);
    setInput("");
  };

  return (
    <div className="flex h-full min-h-screen w-full overflow-hidden flex-1">

      {/* SIDEBAR */}
      <Sidebar
        onSelectChat={loadMessages}
        onNewChat={() => {
          setMessages([]);
          setChatId(null);
        }}
      />

      {/* CHAT AREA */}
      <div className="flex flex-col flex-1 bg-gray-100">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="w-full space-y-4">

            {messages.map((m, i) => {

              if (m.type === "weather") {
                return (
                  <div key={i} className="bg-white shadow rounded-xl p-4 max-w-sm">
                    <div className="text-sm text-gray-500">Weather</div>
                    <div className="text-xl font-semibold">{m.city}</div>
                    <div className="text-3xl">{m.temperature}°C</div>
                    <div className="text-gray-600">{m.condition}</div>
                  </div>
                );
              }

              if (m.type === "stock") {
                return (
                  <div key={i} className="bg-white shadow rounded-xl p-4 max-w-sm">
                    <div className="text-sm text-gray-500">Stock</div>
                    <div className="text-xl font-semibold">{m.symbol}</div>
                    <div className="text-3xl">${m.price}</div>
                  </div>
                );
              }

              if (m.type === "f1") {
                return (
                  <div key={i} className="bg-white shadow rounded-xl p-4 max-w-sm">
                    <div className="text-sm text-gray-500">F1 Race</div>
                    <div className="text-xl font-semibold">{m.race}</div>
                    <div className="text-gray-600">{m.location}</div>
                    <div className="text-gray-500">{m.date}</div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    m.user
                      ? "ml-auto bg-black text-white"
                      : "bg-white shadow"
                  }`}
                >
                  {m.content}
                </div>
              );
            })}

          </div>
        </div>

        {/* INPUT BAR FIXED AT BOTTOM */}
        <div className="border-t bg-white p-4">
          <div className="w-full flex gap-3">
            <input
              className="flex-1 rounded-lg border p-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
            />
            <button
              onClick={sendMessage}
              className="rounded-lg bg-black px-6 py-3 text-white"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
