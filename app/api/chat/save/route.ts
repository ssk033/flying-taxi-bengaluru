import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth/auth"; 


export async function POST(req: NextRequest) {
  // ✅ Get session using the `auth()` function from your auth.js file
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, messages } = await req.json();

    if (!title || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title,
        messages: {
          create: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          })),
        },
      },
      include: { messages: true },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
