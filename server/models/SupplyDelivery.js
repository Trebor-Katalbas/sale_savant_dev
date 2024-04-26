import mongoose from "mongoose";

const SupplyDeliverySchema = new mongoose.Schema(
  {
    supplier: [
      {
        supplierId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Supplier",
          required: true,
        },
        supplierName: {
          type: String,
          required: true,
        },
        contactPerson: {
          type: String,
          required: true,
        },
        contactNo: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    deliveryDate: {
      type: Date,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    quantityUnit: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    totalPaid: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const SupplyDelivery = mongoose.model("SupplyDelivery", SupplyDeliverySchema);
export default SupplyDelivery;
