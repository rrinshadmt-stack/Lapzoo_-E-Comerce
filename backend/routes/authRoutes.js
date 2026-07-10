import express from "express";
import protect from "../middleware/auth.js";
import { register, login, getMe, refresh, logout,
     updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.patch("/profile", protect, updateProfile);

export default router;