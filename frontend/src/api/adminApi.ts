import type {
  CreateStoreInput,
  CreateUserInput,
  DashboardStats,
  GetStoresParams,
  GetStoresResponse,
  GetUserResponse,
  GetUsersParams,
  GetUsersResponse,
} from "../types/admin";
import api from "./axios";

export const getDashboardStats = () => {
  return api.get<DashboardStats>("/admin/dashboard");
};

export const createUser = (data: CreateUserInput) => {
  return api.post("/admin/users", data);
};

export const getUsers = (params: GetUsersParams) => {
  return api.get<GetUsersResponse>("/admin/users", {
    params,
  });
};

export const getUserById = (id: string) => {
  return api.get<GetUserResponse>(`/admin/users/${id}`);
};

export const createStore = (data: CreateStoreInput) => {
  return api.post("/admin/stores", data);
};

export const getStores = (params: GetStoresParams) => {
  return api.get<GetStoresResponse>("/admin/stores", {
    params,
  });
};
