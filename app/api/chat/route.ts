import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth/auth";

// If you use Node.js-only modules (like Prisma), force Node.js runtime:
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { timestamp: "asc" },
      },
    },
  });

  return NextResponse.json(chats);
}

