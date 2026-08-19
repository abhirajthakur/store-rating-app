import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middleware/auth.js";
import * as storeOwnerController from "./storeOwner.controller.js";

const router = Router();

router.use(authenticate, authorizeRoles("store_owner"));

router.get("/dashboard", storeOwnerController.dashboard);

export default router;
