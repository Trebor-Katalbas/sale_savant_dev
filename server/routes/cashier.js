import express from "express";
import { createReceipt, AddTable, getOrderReceipt, getTable, updateTableStatus, deleteTable, deleteReceipt, AddOrderSale, getOrderSale, updateReceiptStatus } from "../controllers/cashierReceipt.js";

const router = express.Router();

// Create
router.post("/create-receipt", createReceipt)
router.post("/add-table", AddTable)
router.post("/add-orderSale", AddOrderSale)

// Read
router.get("/get-receipt", getOrderReceipt)
router.get("/get-table", getTable)
router.get("/get-receipt/:id", getOrderSale)

// Update
router.put("/update-table-status", updateTableStatus)
router.put("/update-receipt-status/:id", updateReceiptStatus)

// Delete
router.delete("/delete-table/:id", deleteTable)
router.delete("/delete-receipt/:id", deleteReceipt)

export default router;