import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authService } from "../services/auth.service";

const registerSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const user = await authService.register(
        validated.email,
        validated.password,
        validated.name,
      );
      res.status(201).json({ success: true, user });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(
        validated.email,
        validated.password,
      );
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  }
}

export const authController = new AuthController();
