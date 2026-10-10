import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../services/auth.service";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: Missing or invalid Bearer token header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Unauthorized: Token has expired" });
    }
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid token signature" });
  }
};
