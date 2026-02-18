import { db } from "@/lib/db";
import { chats } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(chats).orderBy(chats.createdAt);
  return NextResponse.json(data);
}
