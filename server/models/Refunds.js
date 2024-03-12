import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema(
  {
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        menuItem: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    orderNo: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    paymentCode: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    amountDiscounted: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalRefund: {
      type: Number,
      required: true,
    },
    newAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Refund = mongoose.model("Refund", RefundSchema);
export default Refund;
