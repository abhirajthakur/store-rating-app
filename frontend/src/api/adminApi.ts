import type { DashboardStats, GetUsersParams, GetUsersResponse } from "../types/admin";
import api from "./axios";

export const getDashboardStats = () => {
  return api.get<DashboardStats>("/admin/dashboard");
};

export const getUsers = (params: GetUsersParams) => {
  return api.get<GetUsersResponse>("/admin/users", {
    params,
  });
};
