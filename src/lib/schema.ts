import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id"),
  role: text("role"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});
