// routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

// Route to register a user
router.post("/register", register);

// Route to login
router.post("/login", login);

export default router;

// Token verification endpoint used by frontend AuthContext
router.get("/api/auth/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update current user's profile (name only, not email/password here)
router.put("/api/users/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const updates = (({ name }) => ({ name }))(req.body);
    if (!updates.name || typeof updates.name !== 'string') {
      return res.status(400).json({ message: 'Invalid name' });
    }

    const updated = await User.findByIdAndUpdate(decoded.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    return res.json({
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: vendor list and moderation
router.get('/api/admin/vendors', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    // Return both current vendors and regular users so admin can re-approve blocked vendors
    const vendors = await User.find({ role: 'vendor' }).select('_id name email role status');
    return res.json(vendors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Note: For demo purposes, we will simulate approve/block by toggling role to 'vendor' and back to 'user'
router.post('/api/admin/vendors/:id/approve', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const updated = await User.findByIdAndUpdate(req.params.id, { role: 'vendor', status: 'active' }, { new: true }).select('name email role status');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/admin/vendors/:id/block', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const updated = await User.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true }).select('name email role status');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete a user (vendor) and all their products
router.delete('/api/admin/vendors/:id', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const vendorId = req.params.id;
    const vendor = await User.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'User not found' });

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    // Delete products by either ObjectId or string vendorId to cover legacy data
    const productDeleteResult = await Product.deleteMany({ $or: [ { vendorId: vendorObjectId }, { vendorId } ] });
    const deletedUser = await User.deleteOne({ _id: vendorObjectId });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found (already deleted)' });
    }
    return res.json({ success: true, deletedProducts: productDeleteResult?.deletedCount || 0, deletedUserId: vendorObjectId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
