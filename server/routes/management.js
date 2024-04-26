import express from "express";
import {
  AddInventory,
  AddMenuLoss,
  AddPromo,
  getMenu,
  getMenuId,
  getInventoryId,
  getMenuInventory,
  getMenuLoss,
  getLossId,
  getMenuPromo,
  deleteMenuInventory,
  cleanInventory,
  deleteMenu,
  deleteMenuLoss,
  deletePromo,
  updateMenu,
  updateInventory,
  updateLoss,
  AddCategory,
  getCategory,
  deleteCategory,
} from "../controllers/management.js";

const router = express.Router();

// Create
router.post("/addinventory", AddInventory);
router.post("/addLoss", AddMenuLoss);
router.post("/addPromo", AddPromo)
router.post("/addCategory", AddCategory)

// Read
router.get("/menu", getMenu);
router.get("/getMenu/:id", getMenuId);
router.get("/menuInventory", getMenuInventory);
router.get("/getInventory/:id", getInventoryId);
router.get("/menuLoss", getMenuLoss);
router.get("/getLoss/:id", getLossId);
router.get("/menuPromo", getMenuPromo)
router.get("/getCategory", getCategory)

// Update
router.put("/editMenu/:id", updateMenu);
router.put("/editInventory/:id", updateInventory);
router.put("/editLoss/:id", updateLoss)

// Delete
router.delete("/category/:id", deleteCategory)
router.delete("/menu/:id", deleteMenu);
router.delete("/menuInventory/:id", deleteMenuInventory);
router.delete("/menuLoss/:id", deleteMenuLoss);
router.delete("/menuPromo/:id", deletePromo)
router.delete("/cleanInventory", cleanInventory)

export default router;
