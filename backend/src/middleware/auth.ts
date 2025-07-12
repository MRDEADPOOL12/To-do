import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret-key"
    ) as JwtPayload;

    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}; 