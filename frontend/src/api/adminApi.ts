import type { DashboardStats } from "../types/admin";
import api from "./axios";

export const getDashboardStats = () => {
  return api.get<DashboardStats>("/admin/dashboard");
};
