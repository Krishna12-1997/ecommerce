import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
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
      .json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  if (token.startsWith("mock-jwt-token-")) {
    const userId = token.replace("mock-jwt-token-", "");
    req.user = { id: userId, role: "user" };
    return next();
  }

  return res.status(401).json({ error: "Unauthorized: Invalid token" });
};
