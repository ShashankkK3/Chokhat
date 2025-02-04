import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('vendorId', 'name');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;