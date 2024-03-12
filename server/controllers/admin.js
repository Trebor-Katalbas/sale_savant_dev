import EOD from "../models/EODRecords.js";
import MenuInventory from "../models/MenuInventory.js";
import OrderSale from "../models/OrderSales.js";
import Refund from "../models/Refunds.js";
import SupplyDelivery from "../models/SupplyDelivery.js";

export const createEOD = async (req, res) => {
  try {
    const { date, startCash } = req.body;

    const orderSales = await OrderSale.find();
    const refund = await Refund.find();
    const supplyRecords = await SupplyDelivery.find();
    const selectedDate = new Date(date);

    const selectedDaySales = orderSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === selectedDate.toDateString();
    });

    const grossSales = selectedDaySales.reduce(
      (total, sale) => total + sale.subTotal,
      0
    );

    const selectedDayDiscounts = orderSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === selectedDate.toDateString();
    });

    const totalDiscounts = selectedDayDiscounts.reduce(
      (total, sale) => total + sale.amountDiscounted,
      0
    );

    const selectedDayRefunds = refund.filter((sale) => {
      const refundDate = new Date(sale.createdAt);
      return refundDate.toDateString() === selectedDate.toDateString();
    });

    const refunds = selectedDayRefunds.reduce(
      (total, refund) => total + refund.totalRefund,
      0
    );

    const selectedDayExpenses = supplyRecords.filter((sale) => {
      const expensesDate = new Date(sale.createdAt);
      return expensesDate.toDateString() === selectedDate.toDateString();
    });

    const expenses = selectedDayExpenses.reduce(
      (total, expenses) => total + expenses.totalPaid,
      0
    );

    const netSales = grossSales - (totalDiscounts + refunds);

    const grossIncome = netSales - expenses;

    const newEOD = new EOD({
      date,
      startCash,
      grossSales: grossSales,
      totalDiscounts: totalDiscounts,
      refunds: refunds,
      netSales: netSales,
      expenses: expenses,
      grossIncome: grossIncome,
    });

    await newEOD.save();

    res.status(201).json(newEOD);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get
export const getEOD = async (req, res) => {
  try {
    const eod = await EOD.find();
    if (!eod) {
      return res.status(404).json({ message: "eod not found" });
    }
    res.status(200).json(eod);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getHighestSold = async (req, res) => {
  try {
    const menu = await MenuInventory.find();

    if (!menu || menu.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    menu.sort((a, b) => b.noSold - a.noSold);

    const top5HighestSold = menu.slice(0, 5);

    res.status(200).json(top5HighestSold);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteEOD = async (req, res) => {
  try {
    const { id } = req.params;

    const eod = await EOD.findById(id);

    if (!eod) {
      return res.status(404).json({ error: "EOD not found" });
    }

    await EOD.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `EOD ${eod._id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting eod:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


