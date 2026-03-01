import express from "express";
import { signup,login } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post("/signup", authLimiter, validate(signupSchema), signup);

router.post("/login", authLimiter, validate(loginSchema), login);

export default router;