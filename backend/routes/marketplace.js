import express from 'express';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js'; // Add this import

const router = express.Router();

// GET all approved products (public marketplace)
router.get('/', async (req, res) => {
  try {
    // Include legacy products with no status set, plus approved
    const products = await Product.find({
      $or: [
        { status: 'approved' },
        { status: { $exists: false } }
      ]
    }).populate('vendorId', 'name');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Add this to your existing marketplace routes
router.post('/', async (req, res) => {
  try {
    // Verify user is vendor/admin
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (user.role === 'vendor' && user.status !== 'active') {
      return res.status(403).json({ message: 'Vendor is blocked or not approved' });
    }

    const product = new Product({
      ...req.body,
      vendorId: user._id,
      status: user.role === 'vendor' ? 'pending' : 'approved'
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Handle /dashboard/vendor directly
router.get('/vendor', async (req, res) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('No token provided');

    // 2. Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find products for this vendor
    const products = await Product.find({ vendorId: decoded.id });
    
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: list pending products
router.get('/admin/pending-products', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const pending = await Product.find({ status: 'pending' }).populate('vendorId', 'name email');
    return res.json(pending);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: approve product
router.post('/admin/products/:id/approve', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const updated = await Product.findByIdAndUpdate(req.params.id, { status: 'approved', rejectionReason: '' }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: reject product with reason
router.post('/admin/products/:id/reject', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { reason = '' } = req.body;
    const updated = await Product.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason: reason }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a vendor product (only owner vendor or admin)
router.put('/vendor/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const updates = (({ name, price, category, stock, image }) => ({ name, price, category, stock, image }))(req.body);

    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    if (user.role === 'vendor' && String(existing.vendorId) !== String(user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a vendor product (only owner vendor or admin)
router.delete('/vendor/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    if (user.role === 'vendor' && String(existing.vendorId) !== String(user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Product.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Place an order for a product (decrement stock atomically)
router.post('/:productId/order', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can place orders' });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentStock = Number(product.stock) || 0;
    if (qty > currentStock) {
      return res.status(400).json({ message: `Only ${currentStock} in stock` });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    res.status(200).json({
      message: 'Order placed',
      product: updatedProduct,
      order: {
        productId: updatedProduct._id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        image: updatedProduct.image,
        quantity: qty,
        placedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;