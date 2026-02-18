"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { Send, Loader2, Cloud, TrendingUp, Flag, FileText, X } from "lucide-react";

export default function ChatPage() {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (!input.trim() || isLoading) return;

    let id = chatId;
    if (!id) id = await createChat(input);

    const userMessage = input;
    setMessages(prev => [
      ...prev,
      { type: "text", content: userMessage, user: true },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage, chatId: id }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const summarizeChat = async () => {
    if (!chatId || messages.length === 0 || isSummarizing) return;

    setIsSummarizing(true);
    setSummary(null);

    try {
      const res = await fetch("/api/chats/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error summarizing chat:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex h-full min-h-screen w-full overflow-hidden flex-1 bg-background">

      {/* SIDEBAR */}
      <Sidebar 
      
        onSelectChat={loadMessages}
        onNewChat={() => {
          setMessages([]);
          setChatId(null);
        }}

      />

      {/* CHAT AREA */}
      <div className="flex flex-col flex-1 relative">

        {/* HEADER WITH SUMMARIZE BUTTON */}
        {messages.length > 0 && (
          <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </h2>
              <button
                onClick={summarizeChat}
                disabled={isSummarizing || !chatId}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Summarizing...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Summarize Chat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scroll-smooth">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            
            {/* SUMMARY CARD */}
            {summary && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Chat Summary</h3>
                  </div>
                  <button
                    onClick={() => setSummary(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[15px] leading-relaxed text-foreground/90">{summary}</p>
              </div>
            )}
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg">
                  <Send className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Start a conversation</h2>
                <p className="text-muted-foreground max-w-md">Ask me anything - I can help with weather, stocks, F1 races, and more!</p>
              </div>
            )}

            {messages.map((m, i) => {
              if (m.type === "weather") {
                return (
                  <div 
                    key={i} 
                    className="bg-card text-card-foreground shadow-lg rounded-2xl p-6 max-w-md border border-border hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Cloud className="w-5 h-5 text-sky-500" />
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weather</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{m.city}</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {m.temperature}°C
                      </div>
                    </div>
                    <div className="text-muted-foreground font-medium">{m.condition}</div>
                  </div>
                );
              }

              if (m.type === "stock") {
                return (
                  <div 
                    key={i} 
                    className="bg-card text-card-foreground shadow-lg rounded-2xl p-6 max-w-md border border-border hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stock</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">{m.symbol}</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      ${m.price}
                    </div>
                  </div>
                );
              }

              if (m.type === "f1") {
                return (
                  <div 
                    key={i} 
                    className="bg-card text-card-foreground shadow-lg rounded-2xl p-6 max-w-md border border-border hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Flag className="w-5 h-5 text-red-500" />
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">F1 Race</div>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">{m.race}</div>
                    <div className="space-y-1">
                      <div className="text-foreground/80 font-medium">{m.location}</div>
                      <div className="text-sm text-muted-foreground">{m.date}</div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`flex ${m.user ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-5 py-3.5 shadow-sm ${
                      m.user
                        ? "bg-gradient-to-br from-primary to-primary/75 text-primary-foreground rounded-br-md shadow-md"
                        : "bg-card text-card-foreground border border-border rounded-bl-md"
                    }`}
                  >
                    <div className={`text-[15px] leading-relaxed ${m.user ? "text-primary-foreground" : "text-foreground"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT BAR FIXED AT BOTTOM */}
        <div className="border-t border-border bg-background/70 backdrop-blur-sm sticky bottom-0 z-10">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
            <div className="w-full flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  className="w-full rounded-xl border border-input px-4 py-3.5 pr-12 text-[15px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all bg-background shadow-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-xl bg-primary px-6 py-3.5 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2 min-w-[100px] justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}