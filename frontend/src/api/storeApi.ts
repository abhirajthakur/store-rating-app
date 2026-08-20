import type {
  GetStoresParams,
  GetStoresResponse,
  SubmitRatingInput,
  SubmitRatingResponse,
} from "../types/store";
import api from "./axios";

export const getStores = (params: GetStoresParams) => {
  return api.get<GetStoresResponse>("/stores", {
    params,
  });
};

export const submitRating = (storeId: string, data: SubmitRatingInput) => {
  return api.post<SubmitRatingResponse>(`/stores/${storeId}/rating`, data);
};

export const updateRating = (storeId: string, data: SubmitRatingInput) => {
  return api.put<SubmitRatingResponse>(`/stores/${storeId}/rating`, data);
};
