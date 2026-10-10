import express, { Application } from "express";
import { authController } from "./controllers/auth.controller";
import { productController } from "./controllers/product.controller";
import { orderController } from "./controllers/order.controller";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/auth/register", (req, res, next) =>
    authController.register(req, res, next),
  );
  app.post("/api/auth/login", (req, res, next) =>
    authController.login(req, res, next),
  );

  app.get("/api/products", (req, res, next) =>
    productController.getProducts(req, res, next),
  );
  app.get("/api/products/:id", (req, res, next) =>
    productController.getProductById(req, res, next),
  );
  app.post("/api/products/batch", (req, res, next) =>
    productController.batchGetProducts(req, res, next),
  );
  app.post("/api/products", authMiddleware, (req, res, next) =>
    productController.createProduct(req, res, next),
  );

  app.post("/api/orders", authMiddleware, (req, res, next) =>
    orderController.createOrder(req, res, next),
  );
  app.get("/api/orders/my-orders", authMiddleware, (req, res, next) =>
    orderController.getMyOrders(req, res, next),
  );

  app.use(errorHandler);

  return app;
}
