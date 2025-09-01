const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
}, { timestamps: true });

const PositionModel = mongoose.model("Position", positionSchema);

module.exports = PositionModel;
