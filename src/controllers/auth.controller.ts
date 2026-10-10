import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const user = await authService.register(email, password, name);
      res.status(201).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
