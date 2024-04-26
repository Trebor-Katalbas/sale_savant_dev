import express from "express";
import { createEOD, deleteEOD, getCashierReport, getEOD, getEODByMonth, getHighestSold } from "../controllers/admin.js";

const router = express.Router();

// Create
router.post("/create-eod", createEOD)

// Read
router.get("/get-eod", getEOD)
router.get("/get-noSold", getHighestSold)
router.get("/get-cashier-reports", getCashierReport)
router.get("/get-eod-by-month", getEODByMonth);

// Delete
router.delete("/delete-eod/:id", deleteEOD)
export default router;