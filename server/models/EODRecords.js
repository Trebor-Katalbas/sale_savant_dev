import mongoose from "mongoose";

const EODSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startCash: {
      type: Number,
      required: true,
    },
    grossSales: {
      type: Number,
      required: true,
    },
    totalDiscounts: {
      type: Number,
      required: true,
    },
    refunds: {
      type: Number,
      required: true,
    },
    netSales: {
      type: Number,
      required: true,
    },
    expenses: {
      type: Number,
      required: true,
    },
    grossIncome: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const EOD = mongoose.model("EOD", EODSchema);
export default EOD;
