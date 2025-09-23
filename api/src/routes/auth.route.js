import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMe,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/me", protect, getMe);
authRoutes.put("/me", protect, updateProfile);

export default authRoutes;
