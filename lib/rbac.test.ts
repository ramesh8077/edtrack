import { describe, it, expect } from 'vitest';
import { can } from '@/lib/rbac';

describe('RBAC - can() function', () => {
  it('should allow ADMIN to perform any action', () => {
    expect(can('ADMIN', 'user:manage')).toBe(true);
    expect(can('ADMIN', 'path:create')).toBe(true);
    expect(can('ADMIN', 'template:publish')).toBe(true);
  });

  it('should allow MENTOR to manage templates and paths', () => {
    expect(can('MENTOR', 'template:create')).toBe(true);
    expect(can('MENTOR', 'template:publish')).toBe(true);
    expect(can('MENTOR', 'path:create')).toBe(true);
    expect(can('MENTOR', 'user:manage')).toBe(false);
  });

  it('should only allow LEARNER to manage their own paths and quizzes', () => {
    expect(can('LEARNER', 'path:create')).toBe(true);
    expect(can('LEARNER', 'quiz:attempt')).toBe(true);
    expect(can('LEARNER', 'template:publish')).toBe(false);
    expect(can('LEARNER', 'user:manage')).toBe(false);
  });

  it('should handle invalid roles or actions gracefully', () => {
    // Testing runtime safety for invalid inputs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(can('LEARNER' as any, 'invalid:action' as any)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(can('UNKNOWN' as any, 'path:create' as any)).toBe(false);
  });
});
