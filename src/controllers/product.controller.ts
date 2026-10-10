import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts();
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      }
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  async batchGetProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res
          .status(400)
          .json({ success: false, error: "Expected an array of product IDs" });
      }

      if (ids.length > 100) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Batch size cannot exceed 100 items",
          });
      }

      const products = await productService.getProductsByIds(ids);
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price, category, stock, tags } = req.body;
      if (!name || typeof price !== "number") {
        return res
          .status(400)
          .json({
            success: false,
            error: "Missing required fields: name and price",
          });
      }

      const newProduct = await productService.addProduct({
        name,
        description: description || "",
        price,
        category: category || "general",
        stock: stock ?? 0,
        tags: tags || [],
      });

      res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
