import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  role: text("role"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});
