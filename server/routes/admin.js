import express from "express";
import { createEOD, deleteEOD, getEOD, getHighestSold } from "../controllers/admin.js";

const router = express.Router();

// Create
router.post("/create-eod", createEOD)

// Read
router.get("/get-eod", getEOD)
router.get("/get-noSold", getHighestSold)

// Delete
router.delete("/delete-eod/:id", deleteEOD)
export default router;