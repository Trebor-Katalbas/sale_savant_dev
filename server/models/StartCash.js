import mongoose from "mongoose";

const StartCashSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    startCash: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const StartCash = mongoose.model("StartCash", StartCashSchema);
export default StartCash;
