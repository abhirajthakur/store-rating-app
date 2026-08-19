import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as storesController from "./stores.controller.js";
import { listStoresQuerySchema, submitRatingSchema } from "./stores.schema.js";

const router = Router();

router.use(authenticate, authorizeRoles("normal"));

router.get("/", validate(listStoresQuerySchema, "query"), storesController.getStores);
router.post("/:id/rating", validate(submitRatingSchema), storesController.submitOrUpdateRating);
router.put("/:id/rating", validate(submitRatingSchema), storesController.submitOrUpdateRating);

export default router;
