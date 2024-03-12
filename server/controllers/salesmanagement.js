import OrderSales from "../models/OrderSales.js";
import Refund from "../models/Refunds.js";

// Get
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
export const getTotalSaleStats = async (req, res) => {
  try {
    const orderSales = await OrderSales.find();
    const refund = await Refund.find();

    const currentDate = new Date();
    const currentDaySales = orderSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === currentDate.toDateString();
    });

    const totalSaleAmountNoRefund = currentDaySales.reduce(
      (total, sale) => total + sale.totalAmount,
      0
    );

    const currentDayRefund = refund.filter((sale) => {
      const refundDate = new Date(sale.createdAt);
      return refundDate.toDateString() === currentDate.toDateString();
    });

    const totalRefunds = currentDayRefund.reduce(
      (total, refund) => total + refund.totalRefund,
      0
    );

    const totalSaleAmount = totalSaleAmountNoRefund - totalRefunds;

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    const previousDaySales = orderSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === yesterday.toDateString();
    });

    const previousDayTotalSaleAmount = previousDaySales.reduce(
      (total, sale) => total + sale.totalAmount,
      0
    );

    let incomePercentage =
      totalSaleAmount !== 0
        ? ((totalSaleAmount - previousDayTotalSaleAmount) /
            previousDayTotalSaleAmount) *
          100
        : 0;

    incomePercentage = Math.min(parseFloat(incomePercentage.toFixed(2)));

    const formattedDate = currentDate.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const totalSaleStats = {
      totalSaleAmount,
      previousDayTotalSaleAmount,
      incomePercentage,
      totalSaleDate: formattedDate,
    };

    res.status(200).json(totalSaleStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteOrderSale = async (req, res) => {
  try {
    const { id } = req.params;

    const orderSale = await OrderSales.findById(id);

    if (!orderSale) {
      return res.status(404).json({ error: "Order Sale not found" });
    }

    await OrderSales.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Supplier ${orderSale._id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting order sale:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteAllSales = async (req, res) => {
  try {
    await OrderSales.deleteMany({});

    res.status(200).json({ message: "All order sales deleted successfully" });
  } catch (error) {
    console.error("Error deleting all order sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
