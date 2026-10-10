# TaskFlow Backend Service

A modular REST API backend service built with Node.js, Express, and TypeScript.

## Features
- User authentication & authorization
- Product catalog management with batch querying
- Order placement and order history
- Strongly typed domain models with TypeScript

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Installation
```bash
npm install
```

### Running the Server
```bash
# Development mode with hot-reload
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints
- `GET /health` - Service health status
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - List products
- `GET /api/products/:id` - Get single product
- `POST /api/products/batch` - Batch retrieve products by IDs
- `POST /api/products` - Create a product (Protected)
- `POST /api/orders` - Place order (Protected)
- `GET /api/orders/my-orders` - Get current user orders (Protected)
