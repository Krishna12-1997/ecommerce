import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { orderService } from "../services/order.service";
import { Order } from "../types";

export class OrderController {
  async createOrder(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id || "anonymous";
      const { items } = req.body;
      const order = await orderService.createOrder(userId, items);
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async getMyOrders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id || "anonymous";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as Order["status"] | undefined;

      const result = await orderService.getPaginatedOrders(userId, {
        page,
        limit,
        status,
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
