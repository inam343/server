const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    _id:      { type: String },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    oldPrice: { type: Number },
    quantity: { type: Number, default: 1 },
    image:    { type: String },
    brand:    { type: String },
    category: { type: String },
  },
  { _id: false }
);

const shippingInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email:    { type: String },
    phone:    { type: String, required: true },
    address:  { type: String, required: true },
    notes:    { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId:       { type: String, required: true, unique: true }, // "ORD-<timestamp>"
    userId:        { type: String, required: true },               // user._id or username
    shippingInfo:  { type: shippingInfoSchema, required: true },
    items:         { type: [orderItemSchema], required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    totalPrice:    { type: Number, required: true },
    deliveryFee:   { type: Number, default: 0 },
    grandTotal:    { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
