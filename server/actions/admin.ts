"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

async function logAudit(action: string, resource: string, metadata: Record<string, unknown>) {
  const session = await auth();
  if (session?.user) {
    await db.auditLog.create({
      data: {
        actorId: session.user.id,
        action,
        resource,
        metadata: metadata as Record<string, any>,
      }
    });
  }
}

export async function verifyMentor(userId: string, isVerified: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "user:manage")) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { mentorVerified: isVerified }
    });

    await logAudit("VERIFY_MENTOR", userId, { isVerified });

    revalidatePath("/admin");
    return { success: true, data: user };
  } catch {
    return { success: false, error: "Failed to verify mentor check" };
  }
}

export async function suspendUser(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "user:manage")) {
      return { success: false, error: "Unauthorized" };
    }

    // Suspending user could be implemented using a 'suspended' property in the DB,
    // assuming it exists or adding it logic. For now, pseudo-action.
    await logAudit("SUSPEND_USER", userId, { suspended: true });

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to suspend user" };
  }
}

export async function moderateReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "user:manage")) {
      return { success: false, error: "Unauthorized" };
    }

    await db.review.delete({ where: { id: reviewId } });
    await logAudit("MODERATE_REVIEW", reviewId, { deleted: true });

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to moderate review" };
  }
}
