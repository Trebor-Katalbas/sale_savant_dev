import MenuInventory from "../models/MenuInventory.js";
import Menu from "../models/Menu.js";
import MenuLoss from "../models/MenuLoss.js"
import MenuPromo from "../models/MenuPromo.js";
import { getNextSequenceValue } from "../models/Counter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Category from "../models/Category.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Add Function
export const AddMenu = async (req, res) => {
  try {
    const { menuItem, category, price, salesTarget, picturePath, description } =
      req.body;

    const newMenuItem = new Menu({
      menuItem,
      category,
      price,
      salesTarget,
      picturePath,
      description,
    });

    const savedMenuItem = await newMenuItem.save();

    res.status(201).json(savedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const AddInventory = async (req, res) => {
  try {
    const {
      dateTime,
      menuItem,
      category,
      price,
      salesTarget,
      noSold,
      description,
    } = req.body;

    const menuData = await Menu.findOne({ menuItem });

    const newInventoryItem = new MenuInventory({
      dateTime,
      menuItem,
      menuId: await getNextSequenceValue("menuId"),
      category,
      price,
      salesTarget,
      noSold,
      description,
    });

    if (!menuData) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Update Menu salesTarget
    menuData.salesTarget = newInventoryItem.salesTarget;
    menuData.salesTarget -= newInventoryItem.noSold;
    menuData.price = price;
    await menuData.save();

    const savedInventoryItem = await newInventoryItem.save();

    res.status(201).json(savedInventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const AddMenuLoss = async (req, res) => {
  try {
    const {
      dateTime,
      menuItem,
      category,
      salesTarget,
      noSold,
      totalPrice,
      lossQuantity,
      lossPrice,
    } = req.body;

    const newLossItem = new MenuLoss({
      dateTime,
      menuItem,
      category,
      salesTarget,
      noSold,
      totalPrice,
      lossQuantity,
      lossPrice,
    });

    const savedLossItem = await newLossItem.save();

    res.status(201).json(savedLossItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const AddPromo = async (req, res) => {
  try {
    const {
      promoName,
      promoType,
      promoDesc,
      promoValue,
      validDate,
      promoStatus,
      promoUsage,
      applicability,
    } = req.body;

    const newPromo = new MenuPromo({
      promoName,
      promoType,
      promoDesc,
      promoValue,
      validDate,
      promoStatus,
      promoUsage,
      applicability,
    });

    const savedPromo = await newPromo.save();

    res.status(201).json(savedPromo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
export const AddCategory = async (req, res) => {
  try {
    const {
      categoryName,
    } = req.body;

    const newCategory = new Category({
      categoryName,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Get Function
export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getMenuId = async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(200).json(menu);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getMenuInventory = async (req, res) => {
  try {
    const menuInventory = await MenuInventory.find();
    res.status(200).json(menuInventory);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getInventoryId = async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const inventory = await MenuInventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getMenuLoss = async (req, res) => {
  try {
    const menuLoss = await MenuLoss.find();
    res.status(200).json(menuLoss);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getLossId = async (req, res) => {
  try {
    const lossId = req.params.id;
    const loss = await MenuLoss.findById(lossId);
    if (!loss) {
      return res.status(404).json({ message: "Dish Loss not found" });
    }
    res.status(200).json(loss);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getMenuPromo = async (req, res) => {
  try {
    const menuPromo = await MenuPromo.find();
    res.status(200).json(menuPromo);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Delete Function
export const deleteMenuInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await MenuInventory.findById(id);
    if (!existingItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    const menuItem = await Menu.findOne({ menuItem: existingItem.menuItem });
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    menuItem.salesTarget = 0;
    await menuItem.save();

    await MenuInventory.findByIdAndDelete(id);

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const cleanInventory = async (req, res) => {
  try {
    const distinctMenuItems = await MenuInventory.distinct('menuItem');

    await Promise.all(distinctMenuItems.map(async (menuItem) => {
      const menu = await Menu.findOne({ menuItem });

      if (menu) {
        menu.salesTarget = 0;
        await menu.save();
      }
    }));
    
    await MenuInventory.deleteMany({});

    res.status(204).send(); 
  } catch (error) {
    console.error("Error cleaning inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await Menu.findById(id);
    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const promoItem = await MenuPromo.findOne({ menuItem: existingItem.menuItem });
    const lossItem = await MenuLoss.findOne({ menuItem: existingItem.menuItem });
    const inventoryItem = await MenuInventory.findOne({ menuItem: existingItem.menuItem });

    await Menu.findByIdAndDelete(id);

    if (promoItem) {
      await MenuPromo.findByIdAndDelete(promoItem._id);
    }
    if (lossItem) {
      await MenuLoss.findByIdAndDelete(lossItem._id);
    }
    if (inventoryItem) {
      await MenuInventory.findByIdAndDelete(inventoryItem._id);
    }

    if (existingItem.picturePath) {
      const imagePath = path.join(__dirname, "../public/assets", existingItem.picturePath);
      if(!imagePath){
        return res.status(404).json({ error: "image item not found" });
      }
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteMenuLoss = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await MenuLoss.findById(id);

    if (!existingItem) {
      return res.status(404).json({ error: "Dish Loss not found" });
    }

    await MenuLoss.findByIdAndDelete(id);

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await Category.findById(id);

    if (!existingItem) {
      return res.status(404).json({ error: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deletePromo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await MenuPromo.findById(id);

    if (!existingItem) {
      return res.status(404).json({ error: "Promo not found" });
    }

    await MenuPromo.findByIdAndDelete(id);

    res.status(200).json({ message: "Promo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Edit
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuItem, category, price, salesTarget, description } = req.body;

    const existingItem = await Menu.findById(id);

    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    existingItem.menuItem = menuItem;
    existingItem.category = category;
    existingItem.price = price;
    existingItem.salesTarget = salesTarget;
    existingItem.description = description;

    const updatedMenu = await existingItem.save();

    res.status(200).json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dateTime,
      menuItem,
      category,
      price,
      salesTarget,
      noSold,
      description,
    } = req.body;

    const existingItem = await MenuInventory.findById(id);
    const menuData = await Menu.findOne({ menuItem });

    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    existingItem.dateTime = dateTime;
    existingItem.menuItem = menuItem;
    existingItem.category = category;
    existingItem.price = price;
    existingItem.salesTarget = salesTarget;
    existingItem.noSold = noSold;
    existingItem.description = description;

    menuData.salesTarget = existingItem.salesTarget;
    menuData.salesTarget -= existingItem.noSold;
    menuData.price = existingItem.price;
    await menuData.save();

    const updatedInventory = await existingItem.save();

    res.status(200).json(updatedInventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateLoss = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dateTime,
      menuItem,
      category,
      salesTarget,
      noSold,
      totalPrice,
      lossQuantity,
      lossPrice,
    } = req.body;

    const existingItem = await MenuLoss.findById(id);

    if (!existingItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    existingItem.dateTime = dateTime;
    existingItem.menuItem = menuItem;
    existingItem.category = category;
    existingItem.salesTarget = salesTarget;
    existingItem.noSold = noSold;
    existingItem.totalPrice = totalPrice;
    existingItem.lossQuantity = lossQuantity;
    existingItem.lossPrice = lossPrice;

    const updatedMenuLoss = await existingItem.save();

    res.status(200).json(updatedMenuLoss);
  } catch (error) {
    console.error("Error updating dish loss:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
