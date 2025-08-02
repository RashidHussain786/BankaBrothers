# Banka Brother

Banka Brother is a full-stack application for managing products, customers, and orders, with separate interfaces for users and administrators.

## Technologies Used

*   **Frontend:** React (with Vite), TypeScript, Tailwind CSS
*   **Backend:** Node.js (with Express), Prisma, JavaScript
*   **Linting:** ESLint
*   **Package Manager:** npm

## Folder Structure

```
BankaBrother/
├───.github/             # GitHub Actions workflows for CI/CD
├───public/              # Static assets
├───server/              # Backend (Node.js, Express, Prisma)
│   ├───controllers/
│   ├───data/
│   ├───middleware/
│   ├───prisma/          # Prisma schema and migrations
│   ├───routes/
│   └───services/
└───src/                 # Frontend (React, TypeScript)
    ├───components/
    ├───context/
    ├───hooks/
    ├───pages/
    ├───services/
    └───types/
```

## Features

### Admin User Management
Admins can access a user management page to:
*   View a list of all users.
*   View total number of orders for each user.
*   Add new users.
*   Edit existing user roles (admin/user).
*   Delete users.

### Order Management
*   Users can place orders, and their cart contents are saved as new orders.
*   Admins can view all orders on a dedicated management page.
*   Admins can mark orders as "completed".
*   Admins receive real-time toast notifications for new pending orders.

## Development

To start the development server for the frontend:

```bash
npm run dev
```

To start the backend server:

```bash
node server/index.js
```

## Building for Production

To create a production build for the frontend:

```bash
npm run build
```

## Linting

To lint the frontend codebase:

```bash
npm run lint
```

To lint the backend codebase:

```bash
npm run lint --prefix server
```

## Dependencies

Key dependencies include `react`, `react-router-dom`, `react-toastify` for the frontend, and `@prisma/client`, `express`, `jsonwebtoken` for the backend. Full dependency lists are available in `package.json` and `server/package.json`.