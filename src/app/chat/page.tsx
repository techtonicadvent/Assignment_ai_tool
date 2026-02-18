"use client";

import { useEffect, useState } from "react";
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

    setMessages(prev => [...prev, { type: "text", content: input, user: true }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input,
        chatId: id,
      }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, data]);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSelectChat={loadMessages} onNewChat={() => {
        setChatId(null);
        setMessages([]);
      }} />

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[70%] rounded-xl px-4 py-3 ${
                m.user ? "ml-auto bg-black text-white" : "bg-white shadow"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <div className="border-t bg-white p-4 flex gap-3">
          <input
            className="flex-1 rounded-lg border p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
          />
          <button
            onClick={sendMessage}
            className="rounded-lg bg-black px-6 py-2 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
