"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

interface TemplateInput {
  title?: string;
  slug?: string;
  goal: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  structure?: Record<string, unknown>;
}

export async function createTemplate(data: TemplateInput) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "template:create")) {
      return { success: false, error: "Unauthorized" };
    }

    const template = await db.pathTemplate.create({
      data: {
        mentorId: session.user.id,
        title: data.title || "New Template",
        slug: data.slug || crypto.randomUUID().slice(0, 8),
        goal: data.goal,
        level: data.level || "INTERMEDIATE",
        structure: (data.structure as Record<string, unknown>) || {},
        isPublished: false,
      },
    });

    revalidatePath("/studio");
    return { success: true, data: template };
  } catch {
    return { success: false, error: "Failed to create template" };
  }
}

export async function updateTemplate(templateId: string, data: TemplateInput) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "template:update")) {
      return { success: false, error: "Unauthorized" };
    }

    const template = await db.pathTemplate.update({
      where: { id: templateId, mentorId: session.user.id },
      data: {
        title: data.title,
        goal: data.goal,
        level: data.level,
        structure: (data.structure as Record<string, unknown>) || {},
      },
    });

    revalidatePath(`/studio/builder/${templateId}`);
    return { success: true, data: template };
  } catch {
    return { success: false, error: "Failed to save template edits" };
  }
}

export async function publishTemplate(templateId: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "template:publish")) {
      return { success: false, error: "Unauthorized" };
    }

    const template = await db.pathTemplate.update({
      where: { id: templateId, mentorId: session.user.id },
      data: { isPublished },
    });

    revalidatePath("/studio");
    revalidatePath("/templates");
    return { success: true, data: template };
  } catch {
    return { success: false, error: "Failed to toggle publish status" };
  }
}

export async function enrollFromTemplate(templateId: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !can(session.user.role, "template:read")) {
      return { success: false, error: "Unauthorized" };
    }

    // Usually we would fetch the template and explode its structure into LearningPath -> Module -> Lesson
    // Using transaction
    const template = await db.pathTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return { success: false, error: "Template not found" };
    }

    // Creating empty path bounded to template
    const path = await db.learningPath.create({
      data: {
        userId: session.user.id,
        title: template.title,
        goal: template.goal,
        level: template.level,
        targetWeeks: 4,
        source: "TEMPLATE",
        templateId: template.id,
      },
    });

    await db.pathTemplate.update({
      where: { id: template.id },
      data: { enrollmentCount: { increment: 1 } },
    });

    revalidatePath("/dashboard");
    return { success: true, data: path };
  } catch {
    return { success: false, error: "Failed to enroll" };
  }
}
