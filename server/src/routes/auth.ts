// src/routes/auth.ts
import { Router } from "express";
import { register, login, logout } from "../controller/auth";
import authMiddleware from "../middleware/auth";
import authOptional from "../middleware/authOptional";

const router = Router();

router.post("/register", authOptional, register); // optional for first admin
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;
