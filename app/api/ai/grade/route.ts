import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateObject } from "ai";
import { getAIModel } from "@/lib/ai/providers";
import { generatedQuizFeedbackSchema } from "@/lib/ai/schemas";
import { checkRateLimit, aiRateLimiter } from "@/lib/rate-limit";
import { z } from "zod";

// F6 requirement grading open-ended questions can take some time
export const maxDuration = 30;

const payloadSchema = z.object({
  questions: z.array(
    z.object({
      questionId: z.string(),
      prompt: z.string(),
      userAnswer: z.string(),
      rubric: z.string().optional(),
    }),
  ),
});

export async function POST(req: Request) {
  try {
    // 1. Session Auth
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    // 2. Rate Limiting (20/hour/user)
    const limit = await checkRateLimit(aiRateLimiter, `grade:${userId}`);
    if (!limit.success) {
      return new Response("Quiz grading rate limit exceeded.", { status: 429 });
    }

    // 3. Request Validation
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return new Response("Invalid request payload", { status: 400 });
    }

    const { questions } = parsed.data;

    // 4. Generate AI Evaluation
    const systemPrompt = `You are a strict but fair AI grader.
Evaluate the student's open-ended answers against the provided rubrics and context.
You must return data structurally adhering to the requested schema. Provide a total score (0 to 100), overarching constructive feedback, and line-item question breakdown indicating correctness and constructive analysis.`;

    const payloadContext = JSON.stringify(questions, null, 2);

    const { object, usage } = await generateObject({
      model: getAIModel("structured"),
      schema: generatedQuizFeedbackSchema,
      system: systemPrompt,
      prompt: `Grade these attempts:\n\n${payloadContext}`,
    });

    return NextResponse.json({
      success: true,
      data: object,
      tokensUsed: usage.totalTokens,
    });
  } catch (error) {
    console.error("[grade]", error);
    return new Response("Failed to grade assessment.", { status: 500 });
  }
}
