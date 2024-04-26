import express from "express";
import { addStartCash, deleteAllSales, deleteOrderSale, deleteStartCash, getCurrentStartCash, getOrderSale, getStartCash, getTotalSaleStats } from "../controllers/salesmanagement.js";

const router = express.Router();

// Create
router.post("/add-startcash", addStartCash)

// Read
router.get("/get-orderSales", getOrderSale)
router.get("/get-totalSaleStats", getTotalSaleStats)
router.get('/get-startcash-all', getStartCash)
router.get("/get-current-startcash", getCurrentStartCash)

// Delete
router.delete("/delete-orderSale/:id", deleteOrderSale)
router.delete("/delete-startcash/:id", deleteStartCash)
router.delete("/delete-allSale", deleteAllSales)

export default router;