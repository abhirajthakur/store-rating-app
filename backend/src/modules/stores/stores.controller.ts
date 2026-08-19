import * as storesService from "./stores.service.js";

import type { NextFunction, Request, Response } from "express";
import type { ListStoresQuery, SubmitRatingInput } from "./stores.schema.js";

export async function getStores(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as ListStoresQuery;
    const stores = await storesService.listStoresForUser(req.user!.id, query);
    res.json({ stores });
  } catch (err) {
    next(err);
  }
}

export async function submitOrUpdateRating(req: Request, res: Response, next: NextFunction) {
  try {
    const { rating } = req.body as SubmitRatingInput;
    const result = await storesService.upsertRating(req.user!.id, req.params.id as string, rating);
    res.status(200).json({ rating: result });
  } catch (err) {
    next(err);
  }
}
