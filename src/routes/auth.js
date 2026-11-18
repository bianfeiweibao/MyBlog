import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../validators/userValidator.js";
import { validate } from "../validators/articleValidator.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);

export default router;
