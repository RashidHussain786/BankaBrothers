# Gemini Project Conventions

This document outlines the conventions and best practices for the Banka Brother project.

## Project Overview

*   **Framework:** React (with Vite) and Node.js (with Express)
*   **Language:** TypeScript and JavaScript
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint
*   **Package Manager:** npm
*   **Version:** 0.0.0

## Folder Structure

```
/home/rashid/Desktop/Project/BankaBrother/
├───eslint.config.js
├───index.html
├───package-lock.json
├───package.json
├───postcss.config.js
├───tailwind.config.js
├───tsconfig.app.json
├───tsconfig.json
├───tsconfig.node.json
├───vite.config.ts
├───dist/
├───node_modules/
├───public/
│   ├───products.json
│   └───store-icon.svg
├───server/
│   ├───controllers/
│   │   ├───adminController.js
│   │   └───...
│   ├───data/
│   │   ├───products.json
│   │   └───users.json
│   ├───middleware/
│   │   └───authMiddleware.js
│   ├───routes/
│   │   ├───adminRoutes.js
│   │   └───...
│   └───services/
│       ├───userService.js
│       └───...
└───src/
    ├───App.tsx
    ├───index.css
    ├───main.tsx
    ├───vite-env.d.ts
    ├───components/
    │   ├───AddToCartModal.tsx
    │   ├───CartIcon.tsx
    │   ├───EditUserModal.tsx
    │   ├───FilterAndSearchArea.tsx
    │   ├───Header.tsx
    │   ├───ItemsPerPageSelector.tsx
    │   ├───Pagination.tsx
    │   ├───ProductCard.tsx
    │   ├───ProductTable.tsx
    │   └───ViewToggle.tsx
    ├───hooks/
    │   ├───useCart.ts
    │   ├───useFiltering.ts
    │   ├───usePagination.ts
    │   ├───useProductFilters.ts
    │   ├───useProducts.ts
    │   └───useSorting.ts
    ├───pages/
    │   ├───AdminUserManagementPage.tsx
    │   ├───CartSummaryPage.tsx
    │   └───...
    ├───services/
    │   ├───adminService.ts
    │   └───productService.ts
    └───types/
        ├───cart.ts
        ├───index.ts
        ├───pagination.ts
        ├───product.ts
        ├───sorting.ts
        └───user.ts
```

## Features

### Admin User Management
Admins can access a user management page to:
*   View a list of all users.
*   Add new users.
*   Edit existing user roles (admin/user).
*   Delete users.

## Development

To start the development server, run:

```bash
npm run dev
```

To start the backend server, run:

```bash
node server/index.js
```

## Building for Production

To create a production build, run:

```bash
npm run build
```

## Linting

To lint the codebase, run:

```bash
npm run lint
```

## Dependencies

This project uses the following dependencies:

### Production Dependencies

*   `lucide-react`: ^0.344.0
*   `react`: ^18.3.1
*   `react-dom`: ^18.3.1
*   `react-router-dom`: ^7.7.1

### Development Dependencies

*   `@eslint/js`: ^9.9.1
*   `@types/react`: ^18.3.5
*   `@types/react-dom`: ^18.3.0
*   `@vitejs/plugin-react`: ^4.3.1
*   `autoprefixer`: ^10.4.18
*   `eslint`: ^9.9.1
*   `eslint-plugin-react-hooks`: ^5.1.0-rc.0
*   `eslint-plugin-react-refresh`: ^0.4.11
*   `globals`: ^15.9.0
*   `postcss`: ^8.4.35
*   `tailwindcss`: ^3.4.1
*   `typescript`: ^5.5.3
*   `typescript-eslint`: ^8.3.0
*   `vite`: ^5.4.2

## Best Practices

### Component Structure

*   Components are located in `src/components`.
*   Components should be functional components using React Hooks.
*   Component props should be defined using TypeScript interfaces.

### Styling

*   Styling is done using Tailwind CSS classes directly in the JSX.
*   Avoid using custom CSS files unless absolutely necessary.

### State Management

*   Local component state should be managed with the `useState` hook.
*   For more complex logic, create custom hooks in the `src/hooks` directory.

### Data Fetching

*   Data is fetched from the `public/products.json` file and the backend server.
*   The `useProducts` custom hook is responsible for fetching and managing product data.
*   The `adminService` is responsible for user management data.

### File Naming

*   Components and hooks should use PascalCase (e.g., `ProductCard.tsx`, `useProducts.ts`).
*   Other files should use kebab-case (e.g., `eslint.config.js`).
