const mongoose = require("mongoose");

const holdingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  avgBuyPrice: { type: Number, required: true },
}, { timestamps: true });

const HoldingsModel = mongoose.model("Holding", holdingsSchema);

module.exports = HoldingsModel;
