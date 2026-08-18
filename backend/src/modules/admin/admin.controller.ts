import * as adminService from "./admin.service.js";

import type { NextFunction, Request, Response } from "express";
import type { ListStoresQuery, ListUsersQuery } from "./admin.schema.js";

export async function dashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function addUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function addStore(req: Request, res: Response, next: NextFunction) {
  try {
    const store = await adminService.createStore(req.body);
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as ListUsersQuery;
    const users = await adminService.listUsers(query);
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function getStores(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as ListStoresQuery;
    const stores = await adminService.listStores(query);
    res.json({ stores });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.getUserDetail(req.params.id as string);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
