import * as storeOwnerService from "./storeOwner.service.js";

import type { NextFunction, Request, Response } from "express";

export async function dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await storeOwnerService.getStoreOwnerDashboard(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
