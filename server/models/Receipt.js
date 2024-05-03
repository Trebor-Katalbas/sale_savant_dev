import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
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
    promoUsed: [
      {
        promoName: {
          type: String,
        },
        promoUsage: {
          type: Number,
        },
      },
    ],
    tableNo: {
      type: String,
      required: true,
    },
    orderNo: {
      type: Number,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
    },
    paymentCode: {
      type: String,
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
    kitchenStatus: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", ReceiptSchema);
export default Receipt;
