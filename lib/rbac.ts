import { Role } from "@prisma/client";

/**
 * Define all possible actions in the system.
 */
type Action =
  | "path:create"
  | "path:read"
  | "path:update"
  | "path:delete"
  | "template:create"
  | "template:read"
  | "template:update"
  | "template:delete"
  | "template:publish"
  | "quiz:attempt"
  | "quiz:create"
  | "chat:create"
  | "chat:read"
  | "user:read"
  | "user:update"
  | "user:delete"
  | "user:manage"
  | "admin:access"
  | "mentor:verify"
  | "analytics:read"
  | "audit:read";

/**
 * RBAC permission matrix.
 */
const permissions: Record<Role, Action[]> = {
  LEARNER: [
    "path:create",
    "path:read",
    "path:update",
    "template:read",
    "quiz:attempt",
    "chat:create",
    "chat:read",
    "user:read",
    "user:update",
    "analytics:read",
  ],
  MENTOR: [
    "path:create",
    "path:read",
    "path:update",
    "template:create",
    "template:read",
    "template:update",
    "template:delete",
    "template:publish",
    "quiz:create",
    "quiz:attempt",
    "chat:create",
    "chat:read",
    "user:read",
    "user:update",
    "analytics:read",
  ],
  ADMIN: [
    "path:create",
    "path:read",
    "path:update",
    "path:delete",
    "template:create",
    "template:read",
    "template:update",
    "template:delete",
    "template:publish",
    "quiz:create",
    "quiz:attempt",
    "chat:create",
    "chat:read",
    "user:read",
    "user:update",
    "user:delete",
    "user:manage",
    "admin:access",
    "mentor:verify",
    "analytics:read",
    "audit:read",
  ],
};

/**
 * Check if a user with the given role can perform an action.
 */
export function can(role: Role, action: Action): boolean {
  const rolePermissions = permissions[role];
  if (!rolePermissions) return false;
  return rolePermissions.includes(action);
}

/**
 * Assert that a user can perform an action, throw if not.
 */
export function authorize(role: Role, action: Action): void {
  if (!can(role, action)) {
    throw new Error(`Unauthorized: role '${role}' cannot perform '${action}'`);
  }
}
