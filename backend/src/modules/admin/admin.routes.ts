import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as adminController from "./admin.controller.js";
import {
  createStoreSchema,
  createUserSchema,
  listStoresQuerySchema,
  listUsersQuerySchema,
} from "./admin.schema.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/dashboard", adminController.dashboard);
router.post("/users", validate(createUserSchema), adminController.addUser);
router.post("/stores", validate(createStoreSchema), adminController.addStore);
router.get("/users", validate(listUsersQuerySchema, "query"), adminController.getUsers);
router.get("/stores", validate(listStoresQuerySchema, "query"), adminController.getStores);
router.get("/users/:id", adminController.getUserById);

export default router;
