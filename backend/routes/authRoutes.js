// routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Route to register a user
router.post("/register", register);

// Route to login
router.post("/login", login);

export default router;
