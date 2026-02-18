"use client";

import { useEffect, useState } from "react";
import { LogOut, MessageSquare, Plus, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar({
  onSelectChat,
  onNewChat,
}: {
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}) {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const load = () => {
    fetch("/api/chats/list")
      .then(res => res.json())
      .then(setChats);
  };

  useEffect(load, []);

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    onSelectChat(id);
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    onNewChat();
    setTimeout(load, 300);
  };

  return (
    <div className="flex w-72 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-sm">

      {/* Header */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold">AI Chat</h1>
        </div>
        <button
          onClick={handleNewChat}
          className="w-full rounded-xl bg-primary py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2">

        {chats.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No chats yet</p>
            <p className="text-xs text-muted-foreground/80 mt-1">Start a new conversation</p>
          </div>
        ) : (
          <div className="px-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`cursor-pointer mx-2 px-4 py-3 rounded-xl mb-1 transition-all group ${
                  selectedChatId === chat.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    selectedChatId === chat.id ? "text-sidebar-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      selectedChatId === chat.id ? "text-sidebar-primary-foreground" : "text-foreground"
                    }`}>
                      {chat.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
     
     
      </div>

      <button 
  onClick={() => signOut({ callbackUrl: "/" })}
  className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl bg-sidebar-accent py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-all"
>
  <LogOut className="w-4 h-4" />
  Logout
</button>

    </div>


  );
}
