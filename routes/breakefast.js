const express = require("express");
const router = express.Router();
const Breakfast = require("../models/breakfast");
const upload = require("../middleware/upload");

// GET all
router.get("/", async (req, res) => {
  try {
    const items = await Breakfast.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single
router.get("/:id", async (req, res) => {
  try {
    const item = await Breakfast.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, brand, price, oldPrice, rating } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";
    const item = new Breakfast({ name, brand, price, oldPrice, rating, image: imageUrl });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, brand, price, oldPrice, rating } = req.body;
    const updateData = { name, brand, price, oldPrice, rating };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

    const updated = await Breakfast.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Breakfast.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
