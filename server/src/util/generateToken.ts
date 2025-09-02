import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = (payload: object) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined"); // optional check
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
