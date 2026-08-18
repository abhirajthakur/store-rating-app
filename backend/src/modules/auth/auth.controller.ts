import type { NextFunction, Request, Response } from "express";
import { loginUser, registerUser, updateUserPassword } from "./auth.service.js";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    await updateUserPassword(req.user!.id, currentPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
}
