"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function createChatSession(title: string, moduleId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "chat:create")) {
      return { success: false, error: "Unauthorized" };
    }

    const chat = await db.chatSession.create({
      data: {
        userId: session.user.id,
        title,
        moduleId,
      },
    });

    return { success: true, data: chat };
  } catch {
    return { success: false, error: "Failed to create chat session" };
  }
}

export async function deleteChatSession(sessionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "chat:create")) {
      return { success: false, error: "Unauthorized" };
    }

    await db.chatSession.delete({
      where: { id: sessionId, userId: session.user.id },
    });

    revalidatePath("/dashboard"); // or specific path bounds
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete chat session" };
  }
}
