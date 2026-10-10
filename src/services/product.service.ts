import { db } from "../database/mock-db";
import { Product } from "../types";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class ProductService {
  private cache = new Map<string, CacheEntry<Product | Product[]>>();
  private readonly DEFAULT_TTL_MS = 60 * 1000;

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(
    key: string,
    data: T,
    ttlMs: number = this.DEFAULT_TTL_MS,
  ): void {
    this.cache.set(key, {
      data: data as any,
      expiry: Date.now() + ttlMs,
    });
  }

  public invalidateCache(): void {
    this.cache.clear();
  }

  async getAllProducts(): Promise<Product[]> {
    const cacheKey = "products:all";
    const cached = this.getFromCache<Product[]>(cacheKey);
    if (cached) return cached;

    const products = db.products;
    this.setCache(cacheKey, products);
    return products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const cacheKey = `products:${id}`;
    const cached = this.getFromCache<Product>(cacheKey);
    if (cached) return cached;

    const product = db.products.find((p) => p.id === id);
    if (product) {
      this.setCache(cacheKey, product);
    }
    return product;
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];

    const idSet = new Set(ids);
    const productMap = new Map(db.products.map((p) => [p.id, p]));

    const results: Product[] = [];
    for (const id of idSet) {
      const product = productMap.get(id);
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
    this.invalidateCache();
    return newProduct;
  }
}

export const productService = new ProductService();
