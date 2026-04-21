import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema, pathGoalSchema } from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should fail on short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    it('should validate complex signup requirements', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail if passwords do not match', () => {
      const result = signupSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        throw new Error("Validation should have failed");
      }
      const issue = result.error.issues[0];
      if (!issue) throw new Error("No validation issues found");
      expect(issue.message).toBe("Passwords don't match");
    });
  });

  describe('pathGoalSchema', () => {
    it('should fail on too short goal description', () => {
      const result = pathGoalSchema.safeParse({
        goal: 'short',
        level: 'BEGINNER',
        targetWeeks: 4,
      });
      expect(result.success).toBe(false);
    });

    it('should validate valid path goals', () => {
      const result = pathGoalSchema.safeParse({
        goal: 'I want to learn professional fullstack web development using Next.js and Prisma.',
        level: 'BEGINNER',
        targetWeeks: 12,
      });
      expect(result.success).toBe(true);
    });
  });
});
