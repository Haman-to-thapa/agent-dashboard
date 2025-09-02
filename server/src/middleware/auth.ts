import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import { isTokenBlacklisted } from "../controller/auth";

declare global {
  namespace Express {
    interface Request {
        user?: IUser & { _id: string };
    }
  }
}

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: "Token is logged out, please login again" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = {
      ...user.toObject(),
      _id: user._id.toString(), 
    };
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}
