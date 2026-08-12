const express = require("express");
const router = express.Router();
const Featuredproduct = require("../models/featuredproduct");
const upload = require("../middleware/upload");
const imageUrl = require("../middleware/imageUrl");

// GET all
router.get("/", async (req, res) => {
  try {
    const products = await Featuredproduct.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single
router.get("/:id", async (req, res) => {
  try {
    const product = await Featuredproduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, brand, price, oldPrice, rating } = req.body;
    const image = req.file ? imageUrl(req.file) : (req.body.image || "");

    const product = new Featuredproduct({ name, brand, price, oldPrice, rating, image });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, brand, price, oldPrice, rating } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (price !== undefined) updateData.price = price;
    if (oldPrice !== undefined) updateData.oldPrice = oldPrice;
    if (rating !== undefined) updateData.rating = rating;
    if (req.file) updateData.image = imageUrl(req.file);

    const updated = await Featuredproduct.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Featuredproduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
