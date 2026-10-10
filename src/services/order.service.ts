import { db } from "../database/mock-db";
import { Order, OrderItem } from "../types";

export interface PaginationOptions {
  page: number;
  limit: number;
  status?: Order["status"];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class OrderService {
  async createOrder(userId: string, items: OrderItem[]): Promise<Order> {
    if (!items || !Array.isArray(items) || items.length === 0) {
      const err: any = new Error("Order must contain at least one item");
      err.status = 400;
      throw err;
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId,
      items,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: "PENDING",
      createdAt: new Date(),
    };

    db.orders.push(newOrder);
    return newOrder;
  }

  async getPaginatedOrders(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Order>> {
    // Enforce safe boundary defaults
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 10));

    let userOrders = db.orders.filter((o) => o.userId === userId);

    if (options.status) {
      userOrders = userOrders.filter((o) => o.status === options.status);
    }

    // Sort by latest first
    userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = userOrders.length;
    const startIndex = (page - 1) * limit;
    const items = userOrders.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const orderService = new OrderService();
