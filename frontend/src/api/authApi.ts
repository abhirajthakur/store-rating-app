import type {
  ChangePasswordData,
  LoginData,
  LoginResponse,
  MessageResponse,
  RegisterData,
  RegisterResponse,
} from "../types/auth";
import api from "./axios";

export const loginUser = (data: LoginData) => {
  return api.post<LoginResponse>("/auth/login", data);
};

export const registerUser = (data: RegisterData) => {
  return api.post<RegisterResponse>("/auth/register", data);
};

export const changePassword = (data: ChangePasswordData) => {
  return api.put<MessageResponse>("/auth/password", data);
};
