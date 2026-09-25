const express = require("express");
const Order = require("../models/Order");
const adminAuth = require("../middleware/auth");

const router = express.Router();

/* =========================================
   CREATE NEW ORDER
   Customer can use this without admin login
========================================= */

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(400).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});


/* =========================================
   GET ALL ORDERS
   ADMIN ONLY
========================================= */

router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to get orders",
    });
  }
});


/* =========================================
   UPDATE ORDER STATUS
   ADMIN ONLY
========================================= */

router.patch(
  "/:id/status",
  adminAuth,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Preparing",
        "Ready",
        "Delivered",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: status,
        },
        {
          new: true,
        }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated",
        order: order,
      });
    } catch (error) {
      console.error("Update status error:", error);

      res.status(400).json({
        message: "Failed to update order status",
      });
    }
  }
);


/* =========================================
   DELETE ORDER
   ADMIN ONLY
========================================= */

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(
        req.params.id
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Delete order error:", error);

      res.status(400).json({
        message: "Failed to delete order",
      });
    }
  }
);


module.exports = router;
