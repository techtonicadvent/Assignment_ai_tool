import { db } from "@/lib/db";
import { chats } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.user.email))
    .orderBy(chats.createdAt);
  
  return NextResponse.json(data);
}
