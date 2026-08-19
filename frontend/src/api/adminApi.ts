import type {
  CreateUserInput,
  DashboardStats,
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
