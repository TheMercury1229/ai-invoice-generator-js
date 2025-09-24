import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const invoiceRoutes = express.Router();

invoiceRoutes.post("/", protect, createInvoice);
invoiceRoutes.get("/", protect, getInvoices);
invoiceRoutes.get("/:id", protect, getInvoiceById);
invoiceRoutes.put("/:id", protect, updateInvoice);
invoiceRoutes.delete("/:id", protect, deleteInvoice);

export default invoiceRoutes;
