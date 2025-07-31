# PostgreSQL Migration Plan for Banka Brother

This document outlines the plan to migrate the current file-based data storage (`users.json`, `orders.json`, `products.json`) to a PostgreSQL relational database.

## 1. Introduction

The current file-based storage is suitable for prototyping but lacks the robustness, scalability, concurrency control, and querying capabilities required for a production-ready application. Migrating to PostgreSQL will provide a more reliable, performant, and scalable data persistence layer.

## 2. Database Choice

**Supabase (PostgreSQL)** has been chosen for its reliability, advanced features, strong support for relational data, active community, and integrated services (Auth, Storage, Realtime). We will use **Prisma** as the ORM (Object-Relational Mapper) for type-safe and efficient database interactions.

## 3. Migration Strategy - High-Level Steps

1.  **Database Setup:** Set up a PostgreSQL database on Supabase.
2.  **Backend Dependencies:** Install Prisma and its client library.
3.  **Schema Definition:** Define the database tables and their relationships using **Prisma Schema Language (PSL)**.
4.  **Service Layer Refactoring:** Update existing backend services (`userService`, `orderService`, `productService`) to interact with PostgreSQL using **Prisma Client**.
5.  **API Layer Verification:** Ensure the existing API endpoints continue to function correctly with the new database layer.
6.  **Data Migration (Optional/Manual):** Plan for migrating existing data from JSON files to PostgreSQL.
7.  **Frontend Verification:** Test the frontend application to ensure seamless operation with the new backend.

## 4. Detailed Backend Changes

### 4.1. Install Prisma and its Client

*   Navigate to the project root directory (`/home/rashid/Desktop/Project/BankaBrother/`).
*   Install Prisma CLI and Prisma Client:
    ```bash
    npm install prisma @prisma/client
    npm install -D prisma
    ```
*   Initialize Prisma:
    ```bash
    npx prisma init --datasource-provider postgresql
    ```
    This will create a `prisma/schema.prisma` file and a `.env` file.

### 4.2. Database Connection Setup (Prisma)

*   In your newly created `.env` file, update the `DATABASE_URL` to your Supabase connection string. It will look something like:
    ```
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-PROJECT-ID].supabase.co:5432/postgres"
    ```
    (You'll get this from your Supabase project settings under "Database" -> "Connection String").

### 4.3. Schema Definition (Prisma Schema Language)

Instead of raw SQL, you will define your models in `prisma/schema.prisma`. Prisma will then generate the SQL for you and manage migrations.

#### `prisma/schema.prisma` example:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int      @id @default(autoincrement())
  username    String   @unique
  passwordHash String   @map("password_hash")
  role        String   @default("user")
  orders      Order[] // Relation to Order model

  @@map("users") // Map model name to table name if different
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  company     String?
  unitSize    String?  @map("unit_size")
  itemsPerPack Int?    @map("items_per_pack")
  image       String?
  price       Decimal

  @@map("products")
}

model Order {
  orderId     Int      @id @default(autoincrement()) @map("order_id")
  userId      Int      @map("user_id")
  customerInfo Json    @map("customer_info") // Stores customer name, mobile, address etc. as JSONB
  items       Json     // Stores array of cart items as JSONB
  createdAt   DateTime @default(now()) @map("created_at") // For future filtering by month/year
  status      String   @default("pending")
  user        User     @relation(fields: [userId], references: [id])

  @@map("orders")
}
```

*   **Apply Migrations:** After defining your schema, run:
    ```bash
    npx prisma migrate dev --name initial_migration
    ```
    This command will:
    *   Create a new migration file based on your schema changes.
    *   Apply the migration to your Supabase database, creating the tables.
    *   Generate the Prisma Client (`@prisma/client`) based on your schema.

### 4.4. Service Layer Refactoring (Prisma Client)

Modify the existing service files (`userService.js`, `productService.js`, `orderService.js`) to use the Prisma Client.

First, instantiate the Prisma Client. It's recommended to create a single instance and export it:

```javascript
// server/services/prisma.js (create this file)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
```

Then, in your services:

*   **`userService.js`:**
    *   Import `prisma` from `../services/prisma.js`.
    *   `createUser`: `await prisma.user.create({ data: { username, passwordHash, role } });`
    *   `verifyCredentials`: `await prisma.user.findUnique({ where: { username } });`
    *   `getAllUsers`: `await prisma.user.findMany({ include: { orders: true } });` // Include orders to get total orders for each user
    *   `deleteUser`: `await prisma.user.delete({ where: { id } });`
    *   `updateUser`: `await prisma.user.update({ where: { id }, data: { ... } });`
    *   `addOrderIdToUser`: This logic will be handled by creating an order and linking it to the user via `userId`. The `total_orders` can be computed by counting related orders: `await prisma.order.count({ where: { userId: user.id } });`

*   **`productService.js`:**
    *   Import `prisma` from `../services/prisma.js`.
    *   `getAllProducts`: `await prisma.product.findMany();`
    *   (If import products is implemented via this service, update it to insert/update products in the `products` table using `prisma.product.create` or `prisma.product.upsert`).

*   **`orderService.js`:**
    *   Import `prisma` from `../services/prisma.js`.
    *   `createOrder`: `await prisma.order.create({ data: { userId, customerInfo, items, status } });`
    *   `getAllOrders`: `await prisma.order.findMany({ include: { user: true } });` // Include user to get user info for each order
    *   `updateOrderStatus`: `await prisma.order.update({ where: { orderId }, data: { status } });`
    *   **New Function for Monthly Filtering:**
        ```javascript
        // Example: Get orders for a specific month and year
        async function getOrdersByMonth(year, month) {
            const startDate = new Date(year, month - 1, 1); // month is 1-indexed
            const endDate = new Date(year, month, 0); // Last day of the month
            return prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: { user: true }, // Include user details
            });
        }
        ```

### 4.5. API Layer Verification

*   Ensure `server/index.js` correctly imports and uses the refactored services via their respective controllers and routes.
*   Thoroughly test all existing API endpoints (`/api/auth`, `/api/admin/users`, `/api/products`, `/api/order`) to confirm they interact correctly with the PostgreSQL database.

## 5. Frontend Changes

The frontend should require minimal changes, as the API contract (request/response formats) should ideally remain the same.

*   **Verify Data Flow:** After backend migration, ensure all data fetching and sending operations on the frontend (e.g., displaying users, placing orders, updating order status) work as expected.
*   **Error Handling:** Confirm that error messages from the backend are still handled gracefully.

## 6. Data Migration (Manual/Scripted)

*   **Backup:** Before starting, ensure you have backups of your current `users.json`, `orders.json`, and `products.json` files.
*   **Scripting:** Write a one-time Node.js script that reads data from your existing JSON files and inserts it into the newly created PostgreSQL tables using the Prisma Client. This script will connect to the database via Prisma.

## 7. Verification

*   **Unit/Integration Tests:** If applicable, update or create tests for the new database interactions.
*   **Manual Testing:**
    *   Create new users, products, and orders.
    *   Verify user management (add, edit, delete users).
    *   Verify order management (view, update status).
    *   Check that data persists correctly after server restarts.
    *   Ensure all frontend features dependent on this data work as expected.
    *   **Test new filtering capabilities** (e.g., by month/year).

This plan provides a structured approach to migrating your application to PostgreSQL with Supabase and Prisma. We will tackle each step systematically when you are ready.
