import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
} from "../controllers/ai.controller.js";
const aiRouter = express.Router();

aiRouter.post("/parse-text", protect, parseInvoiceFromText);
aiRouter.post("/generate-reminder", protect, generateReminderEmail);
aiRouter.get("/dashboard-summary", protect, getDashboardSummary);

export default aiRouter;
