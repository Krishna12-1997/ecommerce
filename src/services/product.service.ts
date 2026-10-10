import { db } from "../database/mock-db";
import { Product } from "../types";

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return db.products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return db.products.find((p) => p.id === id);
  }

  async getProductsByIdsSequential(ids: string[]): Promise<Product[]> {
    const results: Product[] = [];
    for (const id of ids) {
      const product = db.products.find((p) => p.id === id);
      if (product) {
        results.push(product);
      }
    }
    return results;
  }

  async addProduct(data: Omit<Product, "id">): Promise<Product> {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...data,
    };
    db.products.push(newProduct);
    return newProduct;
  }
}

export const productService = new ProductService();
