import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitStore>();

export const rateLimiter = (maxRequests = 50, windowMs = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const now = Date.now();

    const record = tracker.get(ip);

    if (!record || now > record.resetTime) {
      tracker.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please slow down and try again shortly.",
      });
    }

    record.count++;
    return next();
  };
};
