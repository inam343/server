const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST /api/orders — place a new order
router.post("/", async (req, res) => {
  try {
    const {
      orderId,
      userId,
      shippingInfo,
      items,
      paymentMethod,
      totalPrice,
      deliveryFee,
      grandTotal,
    } = req.body;

    if (!orderId || !userId || !shippingInfo || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    // Prevent duplicate order IDs (e.g. accidental double-submit)
    const existing = await Order.findOne({ orderId });
    if (existing) {
      return res.status(409).json({ message: "Order already exists", order: existing });
    }

    const newOrder = new Order({
      orderId,
      userId,
      shippingInfo,
      items,
      paymentMethod: paymentMethod || "Cash on Delivery",
      totalPrice,
      deliveryFee: deliveryFee ?? 0,
      grandTotal,
      status: "Pending",
    });

    const saved = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: saved });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders — get ALL orders (admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/user/:userId — get orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/orders/:id/status — update order status (admin)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const VALID = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!VALID.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/orders/:id — delete an order (admin)
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
