require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const exportRoutes = require("./routes/export");
const notifyRoutes = require("./routes/notify");
const paymentRoutes = require("./routes/payment");
const { auth, isAdmin } = require("./middleware/auth");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tradenest";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    return res.json(allHoldings);
  } catch (err) {
    console.error("[GET /allHoldings] Error:", err);
    return res.status(500).json({ message: "Server error fetching holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    return res.json(allPositions);
  } catch (err) {
    console.error("[GET /allPositions] Error:", err);
    return res.status(500).json({ message: "Server error fetching positions" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty) {
      return res.status(400).json({ message: "Missing required fields (name, qty)" });
    }

    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();
    return res.status(201).json({ message: "Order saved successfully", order: newOrder });
  } catch (err) {
    console.error("[POST /newOrder] Error:", err);
    return res.status(500).json({ message: "Server error saving order" });
  }
});

app.get("/api/user-dashboard", auth, (req, res) => {
  return res.json({ msg: "Welcome User Dashboard", user: req.user });
});

app.get("/api/admin-dashboard", auth, isAdmin, (req, res) => {
  return res.json({ msg: "Welcome Admin Dashboard", user: req.user });
});

app.use((err, req, res, next) => {
  console.error("[GLOBAL ERROR]", err);
  res.status(500).json({ message: "Something went wrong" });
});

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  try {
    await mongoose.disconnect();
    console.log("Mongo disconnected");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown", err);
    process.exit(1);
  }
});
