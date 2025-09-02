// middleware/authOptional.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
    }
  }
}

export default async function authOptional(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(); // no token, continue
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(payload.id).select("-password");
    if (user) {
      req.user = {
        ...user.toObject(),
        _id: user._id.toString(), // convert ObjectId to string
      };
    }
    next();
  } catch (err) {
    next(); // invalid token, just ignore
  }
}
