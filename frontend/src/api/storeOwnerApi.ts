import type { StoreOwnerDashboard } from "../types/storeOwner";
import api from "./axios";

export const getStoreOwnerDashboard = () => {
  return api.get<StoreOwnerDashboard>("/store-owner/dashboard");
};
