// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Load secret from .env
const JWT_SECRET = process.env.JWT_SECRET;

// ========== REGISTER ==========
// controllers/authController.js
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body; // Default role: 'user'

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 2. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const initialStatus = role === 'vendor' ? 'pending' : 'active';
    const newUser = new User({ name, email, password: hashedPassword, role, status: initialStatus });
    await newUser.save();

    // 3. Auto-generate token and login (NEW)
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Return same structure as login
    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

   // In login controller, ensure sensitive data isn't leaked
 res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
});
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};