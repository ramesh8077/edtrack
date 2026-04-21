import { z } from "zod";

/**
 * Zod schema corresponding to the PathTemplate/LearningPath modules and lessons.
 * Strictly used by generateObject() to produce fully typed structures from LLMs.
 */
export const generatedPathSchema = z.object({
  modules: z.array(
    z.object({
      title: z.string().describe("Clear, concise module title"),
      description: z.string().describe("Brief description of what the module covers"),
      estimatedHours: z.number().int().min(1).describe("Estimated time to complete module"),
      lessons: z.array(
        z.object({
          title: z.string().describe("Lesson specific title"),
          contentMd: z.string().describe("Comprehensive raw markdown content of the lesson. Includes thorough explanations, analogies, and code snippets where relevant. Should be at least 3-4 paragraphs long."),
          estimatedMinutes: z.number().int().min(5).max(120),
        })
      ),
      quiz: z.object({
        title: z.string(),
        passingScore: z.number().int().default(70),
        questions: z.array(
          z.object({
            prompt: z.string(),
            type: z.enum(["MCQ", "MSQ", "OPEN"]),
            options: z.array(z.string()).optional().describe("Provide exactly 4 string options if type is MCQ or MSQ. Omit if OPEN."),
            correctAnswer: z.union([z.string(), z.array(z.string())]).describe("A single string identical to one of the options for MCQ. An array of option strings for MSQ. Or a highly detailed string for OPEN."),
            explanation: z.string(),
            difficulty: z.number().int().min(1).max(3),
          })
        ).length(5).describe("Generate exactly 5 questions per quiz. Make them varied in difficulty."),
      })
    })
  ).min(4).max(8).describe("Generate between 4 and 8 modules forming a comprehensive start-to-finish syllabus."),
});

/**
 * AI Graded feedback for OPEN ended question attempts
 */
export const generatedQuizFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().describe("Constructive overall feedback"),
  perQuestion: z.array(
    z.object({
      questionId: z.string(),
      isCorrect: z.boolean(),
      pointsEarned: z.number(),
      aiFeedback: z.string(),
    })
  ),
});
