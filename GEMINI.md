
# Gemini Project Conventions

This document outlines the conventions and best practices for the Banka Brother project.

## Project Overview

*   **Framework:** React (with Vite)
*   **Language:** TypeScript
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
│   └───products.json
└───src/
    ├───App.tsx
    ├───index.css
    ├───main.tsx
    ├───vite-env.d.ts
    ├───components/
    │   ├───FilterAndSearchArea.tsx
    │   ├───Header.tsx
    │   ├───ItemsPerPageSelector.tsx
    │   ├───Pagination.tsx
    │   ├───ProductCard.tsx
    │   ├───ProductTable.tsx
    │   └───ViewToggle.tsx
    └───hooks/
        ├───usePagination.ts
        ├───useProducts.ts
        └───useSorting.ts
```

## Development

To start the development server, run:

```bash
npm run dev
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

*   Data is fetched from the `public/products.json` file.
*   The `useProducts` custom hook is responsible for fetching and managing product data.

### File Naming

*   Components and hooks should use PascalCase (e.g., `ProductCard.tsx`, `useProducts.ts`).
*   Other files should use kebab-case (e.g., `eslint.config.js`).

### Code Formatting

*   The code should be consistently formatted.
*   While not explicitly configured, it is recommended to use a code formatter like Prettier.
