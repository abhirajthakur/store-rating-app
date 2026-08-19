export type DashboardStats = {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  address: string;
  role: "admin" | "normal";
  createdAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  address: string;
  password: string;
  role: "admin" | "normal" | "store_owner";
};

export type GetUsersParams = {
  name?: string;
  email?: string;
  address?: string;
  role?: "admin" | "normal";
  sortBy?: "name" | "email" | "address" | "role" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type GetUsersResponse = {
  users: AdminUser[];
};

export type AdminStore = {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
};

export type GetStoresParams = {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: "name" | "email" | "address" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type GetStoresResponse = {
  stores: AdminStore[];
};
