import { z } from "zod";

/**
 * Login form validation schema.
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Signup form validation schema.
 */
export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Learning path goal form validation schema.
 */
export const pathGoalSchema = z.object({
  goal: z
    .string()
    .min(20, "Please describe your goal in more detail (min 20 characters)")
    .max(500, "Goal description is too long"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  targetWeeks: z.number().min(1).max(52),
});

/**
 * Template review form validation schema.
 */
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

/**
 * User profile update validation schema.
 */
export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PathGoalInput = z.infer<typeof pathGoalSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/**
 * Quiz attempt submission schema.
 */
export const quizSubmissionSchema = z.object({
  quizId: z.string().cuid(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

/**
 * AI Chat input schema.
 */
export const chatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    }),
  ),
  lessonContext: z
    .object({
      title: z.string(),
      content: z.string(),
    })
    .optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
