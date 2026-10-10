import { db } from "../database/mock-db";
import { Order, OrderItem } from "../types";

export class OrderService {
  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId,
      items,
      totalAmount,
      status: "PENDING",
      createdAt: new Date(),
    };

    db.orders.push(newOrder);
    return newOrder;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.orders.filter((o) => o.userId === userId);
  }
}

export const orderService = new OrderService();
