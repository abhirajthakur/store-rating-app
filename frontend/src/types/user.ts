export type UserRole = "admin" | "normal" | "store_owner";

export type User = {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: string;
};
