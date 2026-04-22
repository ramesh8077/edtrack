"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function completeLesson(lessonId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "path:update")) {
      return { success: false, error: "Unauthorized" };
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: { completedAt: new Date() },
    });

    revalidatePath(`/dashboard`);
    return { success: true, data: lesson };
  } catch {
    return { success: false, error: "Failed to complete lesson" };
  }
}

export async function submitQuizAttempt(
  quizId: string,
  score: number,
  answersRaw: Record<string, unknown>,
  aiFeedback?: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "quiz:attempt")) {
      return { success: false, error: "Unauthorized" };
    }

    const attempt = await db.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        answers: answersRaw as Record<string, unknown>,
        aiFeedback,
      },
    });

    return { success: true, data: attempt };
  } catch {
    return { success: false, error: "Failed to submit quiz attempt" };
  }
}
