import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../util/hashPassword';
import User from '../models/user';
import { generateToken } from '../util/generateToken';

let tokenBlacklist: string[] = [];


export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const adminCount = await User.countDocuments({ role: "admin" });
    if (role === "admin" && adminCount > 0) {
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(401)
          .json({ message: "Only admins can create admin accounts" });
      }
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: role || "user" });

    const token = generateToken({ id: user._id, role: user.role });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token, // <-- add token here
    });
  } catch (error: any) {
    console.error("Server failed at register", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};




// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: user.role });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      message: `${user.role} login successful`,
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Server failed at login", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const logout = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(400).json({ message: "No token provided" });

  // Add token to blacklist
  tokenBlacklist.push(token);

  res.json({ message: "Logged out successfully" });
};

// Helper to check blacklist in authMiddleware
export const isTokenBlacklisted = (token: string) => tokenBlacklist.includes(token);