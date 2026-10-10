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
      const ids = req.body.ids as string[];
      if (!ids || !Array.isArray(ids)) {
        return res
          .status(400)
          .json({ success: false, error: "Expected array of product ids" });
      }
      const products = await productService.getProductsByIdsSequential(ids);
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const newProduct = await productService.addProduct(req.body);
      res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
