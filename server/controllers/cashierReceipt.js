import Receipt from "../models/Receipt.js";
import Menu from "../models/Menu.js";
import Table from "../models/Table.js";
import MenuInventory from "../models/MenuInventory.js";
import MenuPromo from "../models/MenuPromo.js";
import OrderSales from "../models/OrderSales.js";
import Refund from "../models/Refunds.js"

// Add
export const createReceipt = async (req, res) => {
  try {
    const {
      items,
      orderType,
      tableNo,
      orderNo,
      subTotal,
      amountDiscounted,
      totalAmount,
      status,
      promoUsed,
    } = req.body;
    let salesTargetDeducted = false;

    // Iterate through items to deduct salesTarget for each menu item
    for (const item of items) {
      const menu = await Menu.findById(item.menuItemId);
      if (!menu) {
        return res
          .status(404)
          .json({ message: `Menu item ${item.menuItemId} not found` });
      }
      if (item.quantity > menu.salesTarget) {
        return res.status(400).json({
          message: `Not enough sales target available for menu item ${menu.menuItem}`,
        });
      }
      menu.salesTarget -= item.quantity;
      await menu.save();
      salesTargetDeducted = true;

      // Deduct the quantity of the dish from the existing inventory
      const existingInventory = await MenuInventory.findOne({
        menuItem: menu.menuItem,
      });
      if (existingInventory) {
        existingInventory.noSold += item.quantity;
        await existingInventory.save();
      }
    }

    // Update promo usage
    if (promoUsed && promoUsed.length > 0) {
      for (const promo of promoUsed) {
        const menuPromo = await MenuPromo.findOne({
          promoName: promo.promoName,
        });
        if (menuPromo) {
          menuPromo.promoUsage += promo.promoUsage;
          await menuPromo.save();
        }
      }
    }

    if (!salesTargetDeducted) {
      return res.status(400).json({ message: "No sales target deducted" });
    }

    const newReceipt = new Receipt({
      items,
      orderType,
      tableNo,
      orderNo,
      subTotal,
      amountDiscounted,
      totalAmount,
      status,
      promoUsed,
    });
    const savedReceipt = await newReceipt.save();
    res.status(201).json(savedReceipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const AddOrderSale = async (req, res) => {
  try {
    const {
      orderNo,
      paymentType,
      paymentCode,
      orderType,
      noItems,
      promoUsed,
      subTotal,
      amountDiscounted,
      totalAmount,
      amountPaid,
    } = req.body;

    const newOrderSale = new OrderSales({
      orderNo,
      paymentType,
      paymentCode,
      orderType,
      noItems,
      promoUsed,
      subTotal,
      amountDiscounted,
      totalAmount,
      amountPaid,
    });

    const savedOrderSale = await newOrderSale.save();

    res.status(201).json(savedOrderSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const addRefund = async (req, res) => {
  try {
    const {
      items,
      orderNo,
      paymentType,
      paymentCode,
      subTotal,
      amountDiscounted,
      totalAmount,
      totalRefund,
      newAmount,
    } = req.body;

    const refund = new Refund({
      items,
      orderNo,
      paymentType,
      paymentCode,
      subTotal,
      amountDiscounted,
      totalAmount,
      totalRefund,
      newAmount,
    });

    const savedRefund = await refund.save();
    res.status(201).json(savedRefund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const AddTable = async (req, res) => {
  try {
    const { tableNo, pax, status } = req.body;

    const newTable = new Table({
      tableNo,
      pax,
      status,
    });

    const savedTable = await newTable.save();

    res.status(201).json(savedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get
export const getOrderReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.find();
    res.status(200).json(receipt);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getTable = async (req, res) => {
  try {
    const table = await Table.find();
    res.status(200).json(table);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getOrderSale = async (req, res) => {
  try {
    const orderSale = await OrderSales.find();
    if (!orderSale) {
      return res.status(404).json({ message: "Order Sale not found" });
    }
    res.status(200).json(orderSale);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getRefund = async (req, res) => {
  try {
    const refund = await Refund.find();
    if (!refund) {
      return res.status(404).json({ message: "refund not found" });
    }
    res.status(200).json(refund);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getOrderSaleNo = async (req, res) => {
  try {
    const { id } = req.params;

    const orderSales = await OrderSales.findById(id);

    if (!orderSales || orderSales.length === 0) {
      return res.status(404).json({ message: `Order sales for order ${id} not found` });
    }

    res.status(200).json(orderSales);
  } catch (error) {
    console.error('Error retrieving order sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Update
export const updateTableStatus = async (req, res) => {
  try {
    const updatedTables = req.body;

    for (const updatedTable of updatedTables) {
      const { tableNo, status } = updatedTable;

      await Table.findOneAndUpdate({ tableNo }, { status });
    }

    res.status(200).json({ message: "Table statuses updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, paymentType, paymentCode, items, totalAmount, subTotal, amountDiscounted } = req.body; 

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      id,
      { paymentType, paymentCode, status, items, totalAmount, subTotal, amountDiscounted },
      { new: true }
    );

    if (!updatedReceipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.status(200).json(updatedReceipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    await Table.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Table ${table.tableNo} deleted successfully` });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await Receipt.findById(id);

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    await Receipt.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Receipt ${receipt.id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
