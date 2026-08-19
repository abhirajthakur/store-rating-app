import type { UserRole } from "../types/user";

export function getRedirectPath(role: UserRole) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (role === "normal") {
    return "/stores";
  }

  return "/store-owner/dashboard";
}
