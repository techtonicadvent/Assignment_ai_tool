"use client";

import { useEffect, useState } from "react";

export default function Sidebar({
  onSelectChat,
  onNewChat,
}: {
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}) {
  const [chats, setChats] = useState<any[]>([]);

  const load = () => {
    fetch("/api/chats/list")
      .then(res => res.json())
      .then(setChats);
  };

  useEffect(load, []);

  return (
    <div className="flex w-64 flex-col bg-white border-r">
      <div className="p-4">
        <button
          onClick={() => {
            onNewChat();
            setTimeout(load, 300);
          }}
          className="w-full rounded-lg bg-black py-2 text-white"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}
