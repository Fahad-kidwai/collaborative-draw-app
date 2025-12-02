import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] ?? "";
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded && typeof decoded === "object" && "userId" in decoded) {
      req.userId = decoded.userId as string;
      next();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
