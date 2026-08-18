import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { login, register, updatePassword } from "./auth.controller.js";
import { loginSchema, registerSchema, updatePasswordSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.put("/password", authenticate, validate(updatePasswordSchema), updatePassword);

export default router;
