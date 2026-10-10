import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { orderService } from "../services/order.service";

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
      const orders = await orderService.getUserOrders(userId);
      res
        .status(200)
        .json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
