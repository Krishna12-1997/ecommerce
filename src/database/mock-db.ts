import { User, Product, Order } from '../types';

export class MockDatabase {
  public users: User[] = [];
  public products: Product[] = [];
  public orders: Order[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.products = [
      {
        id: 'prod-1',
        name: 'Wireless Noise Canceling Headphones',
        description: 'Premium over-ear headphones with ANC',
        price: 199.99,
        category: 'electronics',
        stock: 50,
        tags: ['audio', 'wireless', 'tech']
      },
      {
        id: 'prod-2',
        name: 'Ergonomic Mechanical Keyboard',
        description: 'RGB mechanical keyboard with hot-swappable switches',
        price: 129.5,
        category: 'electronics',
        stock: 35,
        tags: ['keyboard', 'gaming', 'office']
      },
      {
        id: 'prod-3',
        name: 'Ultra-wide 4K Monitor 34 inch',
        description: 'Curved 144Hz HDR display for productivity and gaming',
        price: 499.0,
        category: 'electronics',
        stock: 15,
        tags: ['monitor', 'display', '4k']
      },
      {
        id: 'prod-4',
        name: 'Standing Desk Converter',
        description: 'Adjustable height desk riser for dual monitors',
        price: 149.0,
        category: 'furniture',
        stock: 20,
        tags: ['desk', 'office', 'ergonomic']
      }
    ];
  }
}

export const db = new MockDatabase();
