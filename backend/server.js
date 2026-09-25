const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ============================
// API ROUTES
// ============================

app.get("/api/health", (req, res) => {
  res.json({
    message: "Buna Coffee API is running ☕",
  });
});

app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ============================
// SERVE REACT FRONTEND
// ============================

const frontendPath = path.join(__dirname, "../dist");

app.use(express.static(frontendPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ============================
// MONGODB + SERVER
// ============================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });
