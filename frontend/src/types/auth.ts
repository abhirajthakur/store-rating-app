import type { User } from "./user";

export type RegisterData = {
  name: string;
  email: string;
  address: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  user: User;
};

export type MessageResponse = {
  message: string;
};
