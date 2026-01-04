// lib/permissions.ts
export type Role =
  | "builder"
  | "store_governor"
  | "trust_officer"
  | "admin";

export const APPROVAL_ROLES: Role[] = [
  "store_governor",
  "trust_officer",
  "admin"
];

export function canApprove(role?: Role) {
  return role ? APPROVAL_ROLES.includes(role) : false;
}
