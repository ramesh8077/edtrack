"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

interface CreatePathInput {
  title?: string;
  goal: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  targetWeeks?: number;
  source?: "AI_GENERATED" | "TEMPLATE";
}

export async function createPath(data: CreatePathInput) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "path:create")) {
      return { success: false, error: "Unauthorized" };
    }

    // Minimal placeholder implementation mapped to DB schema structure
    // Normally zod parse the struct here:
    // const parsed = ... data
    const path = await db.learningPath.create({
      data: {
        userId: session.user.id,
        title: data.title || "New Learning Path",
        goal: data.goal,
        level: data.level || "BEGINNER",
        targetWeeks: data.targetWeeks || 4,
        source: data.source || "AI_GENERATED",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: path };
  } catch {
    return { success: false, error: "Failed to create path" };
  }
}

export async function deletePath(pathId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "path:delete")) {
      return { success: false, error: "Unauthorized" };
    }

    await db.learningPath.delete({ where: { id: pathId, userId: session.user.id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete path" };
  }
}

export async function pausePath(pathId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "path:update")) {
      return { success: false, error: "Unauthorized" };
    }

    await db.learningPath.update({
      where: { id: pathId, userId: session.user.id },
      data: { status: "PAUSED" },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to pause path" };
  }
}
