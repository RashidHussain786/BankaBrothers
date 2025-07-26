### Overall Goal: Implement a responsive "Add to Cart" and "Order Summary" flow with a Node.js Express backend.

---

### **Phase 1: Backend Server Setup and Product API Implementation**

**Story 1.1: Initialize Backend Project and Migrate Data**

**Description:** Set up a basic Node.js Express server and move the product data to the backend.

**Acceptance Criteria:**
*   A `server/` directory exists at the project root.
*   `package.json` in `server/` is initialized with `express` and `cors` installed.
*   A basic Express server is running and accessible.
*   `products.json` is moved from `public/` to `server/data/`.
*   `products.json` entries are updated to include `stockQuantity` fields.

**Implementation Steps:**
1.  Create `server/` directory.
2.  Run `npm init -y` in `server/`.
3.  Install `express` and `cors` in `server/`.
4.  Create `server/index.js` (or `server.ts` if using TypeScript) with a basic Express server setup.
5.  Create `server/data/` directory.
6.  Move `public/products.json` to `server/data/products.json`.
7.  Manually update `server/data/products.json` to include `stockQuantity` for each product.

---

**Story 1.2: Implement Product Listing and Detail APIs**

**Description:** Create API endpoints to retrieve product data, including filtering, searching, sorting, and pagination.

**Acceptance Criteria:**
*   `GET /api/products` returns all products.
*   `GET /api/products?search=keyword` filters products by name or company.
*   `GET /api/products?company=Parle` filters products by company.
*   `GET /api/products?category=Biscuits` filters products by category.
*   `GET /api/products?brand=Lays` filters products by brand.
*   `GET /api/products?size=Small` filters products by size.
*   `GET /api/products?inStockOnly=true` filters products to show only those with `stockQuantity > 0`.
*   `GET /api/products?sortColumn=name&sortDirection=asc` sorts products by the specified column and direction.
*   `GET /api/products?page=2&limit=10` paginates the product results.
*   `GET /api/products/:id` returns a single product by its ID.

**Implementation Steps:**
1.  In `server/index.js`, load `products.json`.
2.  Implement the `GET /api/products` endpoint to handle all query parameters for filtering, searching, sorting, and pagination.
3.  Implement the `GET /api/products/:id` endpoint.

---

**Story 1.3: Implement Filter Options and Stock Status APIs**

**Description:** Create API endpoints to provide unique filter options and filter by stock status.

**Acceptance Criteria:**
*   `GET /api/companies` returns a list of unique company names.
*   `GET /api/categories` returns a list of unique product categories.
*   `GET /api/brands` returns a list of unique product brands.
*   `GET /api/sizes` returns a list of unique product sizes.
*   `GET /api/stock-status?status=in|low|out` filters products by stock status (e.g., `in` for `stockQuantity > 10`, `low` for `stockQuantity > 0 && <= 10`, `out` for `stockQuantity === 0`).

**Implementation Steps:**
1.  Implement `GET /api/companies`.
2.  Implement `GET /api/categories`.
3.  Implement `GET /api/brands`.
4.  Implement `GET /api/sizes`.
5.  Implement `GET /api/stock-status`.

---

### **Phase 2: Frontend Integration with Backend APIs**

**Story 2.1: Update `productService.ts` to use Backend APIs**

**Description:** Modify the frontend service layer to fetch data from the new backend APIs.

**Acceptance Criteria:**
*   `productService.getProducts` fetches data from `GET /api/products`, passing all relevant query parameters.
*   `productService` includes new methods to fetch companies, categories, brands, and sizes from their respective API endpoints.
*   All client-side filtering, sorting, and pagination logic is removed from `productService`.

**Implementation Steps:**
1.  Modify `src/services/productService.ts` to make `fetch` requests to the new backend endpoints.
2.  Remove local data loading and processing logic.

---

**Story 2.2: Update Frontend Hooks and Components**

**Description:** Adjust frontend hooks and components to consume data from the updated `productService` and handle the new product structure.

**Acceptance Criteria:**
*   `useProducts.ts` passes all filter, search, sort, and pagination parameters directly to `productService.getProducts`.
*   `useProductFilters.ts` fetches filter options (companies, categories, brands, sizes) from `productService`.
*   `ProductCard.tsx` and `ProductTable.tsx` correctly display product information using `stockQuantity` and `isAvailable`.
*   `AddToCartModal.tsx` uses `stockQuantity` for stock checks.
*   `public/products.json` is deleted.

**Implementation Steps:**
1.  Update `src/hooks/useProducts.ts`.
2.  Update `src/hooks/useProductFilters.ts`.
3.  Update `src/components/ProductCard.tsx`.
4.  Update `src/components/ProductTable.tsx`.
5.  Update `src/components/AddToCartModal.tsx`.
6.  Delete `public/products.json`.

---

### **Phase 3: Order API Implementation and Frontend Submission**

**Story 3.1: Implement Order Submission API**

**Description:** Create a backend API endpoint to receive and log order submissions.

**Acceptance Criteria:**
*   `POST /api/order` accepts a JSON object containing customer information and cart details.
*   The received order data is logged to the console on the backend.

**Implementation Steps:**
1.  In `server/index.js`, implement the `POST /api/order` endpoint.

---

**Story 3.2: Update Cart Summary Page for Order Submission**

**Description:** Modify the Cart Summary Page to send order data to the backend API.

**Acceptance Criteria:**
*   The `handlePlaceOrder` function in `CartSummaryPage.tsx` sends the collected customer and cart data to `POST /api/order`.
*   The frontend handles the API response (e.g., displays success/error messages).

**Implementation Steps:**
1.  Modify `src/pages/CartSummaryPage.tsx` to make the API call.

---

### **Phase 4: Refinement and Testing**

**Story 4.1: Configure CORS and Test End-to-End**

**Description:** Ensure proper communication between frontend and backend, and verify all functionalities.

**Acceptance Criteria:**
*   CORS is correctly configured on the Express server, allowing requests from the frontend origin.
*   All API endpoints are tested using tools like Postman or curl.
*   The entire application flow (product listing, filtering, adding to cart, order submission) works seamlessly.

**Implementation Steps:**
1.  Add `cors` middleware to `server/index.js`.
2.  Perform manual end-to-end testing of the application.

---

### **Phase 5: Frontend Codebase Scaling (Modularization)**

**Story 5.1: Extract Product Listing Page**

**Description:** Refactor `App.tsx` by moving product listing concerns into a dedicated `ProductListingPage` component.

**Acceptance Criteria:**
*   `src/pages/ProductListingPage.tsx` is created and contains all logic and JSX related to product display (filters, grid/table, pagination, loading/error states).
*   `App.tsx` is simplified to primarily handle routing and global components.
*   The `/` route in `App.tsx` renders `ProductListingPage`.

**Implementation Steps:**
1.  Create `src/pages/ProductListingPage.tsx`.
2.  Move relevant code from `App.tsx` to `ProductListingPage.tsx`.
3.  Update `App.tsx` to render `ProductListingPage`.

---

### **Phase 6: Authentication & User Management**

**Phase 6.1: Backend - User Management & Authentication APIs**

**Story 6.1.1: User Data Management (JSON File)**

**Description:** Manage user data (username, password hash, role) in a `users.json` file within the `server/data/` directory.

**Acceptance Criteria:**
*   A `server/data/users.json` file is created.
*   The `users.json` file stores an array of user objects, each with `id`, `username` (unique), `password_hash`, and `role`.
*   Initial `users.json` contains at least one admin user.

**Implementation Steps:**
1.  Create `server/data/users.json`.
2.  Add an initial admin user entry to `users.json` (e.g., `{"id": 1, "username": "admin", "password_hash": "$2a$10$somehashedpassword", "role": "admin"}`). You will need to generate a bcrypt hash for a password like 'password123' beforehand.

---

**Story 6.1.2: User Service & Password Hashing**

**Description:** Implement a backend service to manage user data and securely handle passwords, reading from and writing to `users.json`.

**Acceptance Criteria:**
*   `server/services/userService.js` is created.
*   `userService.js` loads user data from `users.json`.
*   `userService.js` includes a function to create a new user, which:
    *   Generates a random, strong password.
    *   Hashes the password using a secure algorithm (e.g., bcrypt).
    *   Adds the new user (username, password hash, role) to the `users.json` file.
    *   Returns the generated plain-text password to the caller (for the admin to provide to the user).
*   `userService.js` includes a function to verify user credentials for login, which:
    *   Retrieves the user by username from `users.json`.
    *   Compares the provided password with the stored password hash.
    *   Returns user details (excluding password hash) and their role upon successful verification.

**Implementation Steps:**
1.  Create `server/services/userService.js`.
2.  Install a password hashing library (e.g., `bcryptjs`).
3.  Implement `createUser` and `verifyCredentials` functions, handling `users.json` reads/writes.

---

**Story 6.1.3: Authentication API Endpoints**

**Description:** Create backend API endpoints for user login and admin-driven user creation.

**Acceptance Criteria:**
*   `POST /api/auth/login`:
    *   Accepts `username` and `password`.
    *   Calls `userService.verifyCredentials`.
    *   On success, generates a JWT (JSON Web Token) containing user ID and role.
    *   Returns the JWT to the frontend.
    *   On failure, returns an appropriate error (e.g., 401 Unauthorized).
*   `POST /api/admin/users`:
    *   **Requires authentication and authorization (admin role only).**
    *   Accepts new user details (e.g., `username`, `role`).
    *   Calls `userService.createUser`.
    *   Returns the generated username and plain-text password.

**Implementation Steps:**
1.  Create `server/routes/authRoutes.js` and `server/routes/adminRoutes.js`.
2.  Create `server/controllers/authController.js` and `server/controllers/adminController.js`.
3.  Implement JWT generation and verification (e.g., using `jsonwebtoken`).
4.  Implement middleware for authentication (verifying JWT) and authorization (checking user role).
5.  Integrate these routes into `server/index.js`.

---

**Phase 6.2: Frontend - Login & Admin User Creation**

**Story 6.2.1: Login Page Implementation**

**Description:** Create a dedicated login page where users can enter generated credentials to access the application.

**Acceptance Criteria:**
*   A new route `/login` is created.
*   `LoginPage.tsx` component is implemented with input fields for username and password.
*   Form submission sends credentials to a backend login API (e.g., `POST /api/auth/login`).
*   On successful login, an authentication token (e.g., JWT) is received and securely stored (e.g., in `localStorage` for simplicity, or `HttpOnly` cookies if backend supports).
*   User is redirected to the product listing page (`/`) upon successful login.
*   Error messages are displayed for invalid credentials or network issues.

**Implementation Steps:**
1.  Create `src/pages/LoginPage.tsx`.
2.  Define the `/login` route in `src/App.tsx`.
3.  Implement the login form and submission logic in `LoginPage.tsx`.

---

**Story 6.2.2: Authentication Context & Protected Routes**

**Description:** Manage the user's authentication state globally and protect routes that require a logged-in user.

**Acceptance Criteria:**
*   A new `AuthContext` is created (e.g., `src/context/AuthContext.tsx`) to hold the user's login status, user data (if any), and authentication token.
*   `AuthContext` provides functions for login, logout, and checking authentication status.
*   Routes like `/` (product listing) and `/cart` are protected, redirecting unauthenticated users to `/login`.
*   The application checks for an existing token on load to automatically log in the user if a valid session exists.

**Implementation Steps:**
1.  Create `src/context/AuthContext.tsx` with `AuthContext` and `AuthProvider`.
2.  Wrap `App.tsx` with `AuthProvider` in `src/main.tsx`.
3.  Modify `src/App.tsx` to implement route protection using `AuthContext`.

---

**Story 6.2.3: Admin User Creation Interface**

**Description:** Implement an admin-only interface where an authenticated admin can create new user accounts.

**Acceptance Criteria:**
*   A new route `/admin/create-user` is created.
*   This route is protected and only accessible to users with an "admin" role (requires backend role verification).
*   The interface includes input fields for new user details (e.g., email/username, and the backend will generate password).
*   Submission sends data to a backend API (e.g., `POST /api/admin/users`).
*   Upon successful creation, the generated username and password are displayed to the admin.

**Implementation Steps:**
1.  Create `src/pages/AdminCreateUserPage.tsx`.
2.  Define the `/admin/create-user` route in `src/App.tsx`, ensuring it's protected and role-gated.
3.  Implement the user creation form and submission logic in `AdminCreateUserPage.tsx`.

---

**Story 6.2.4: Logout Functionality & Conditional UI**

**Description:** Provide a way for users to log out and adjust UI elements based on authentication status and user role.

**Acceptance Criteria:**
*   A "Logout" button is visible (e.g., in the `Header`) when a user is logged in.
*   Clicking "Logout" clears the authentication token and user state, redirecting to `/login`.
*   An "Admin Panel" link (or similar) is visible only to authenticated admin users.
*   The "Login" button is visible only when the user is logged out.

**Implementation Steps:**
1.  Update `src/components/Header.tsx` to conditionally render "Login"/"Logout" buttons and "Admin Panel" link based on `AuthContext` state.
2.  Implement the logout function within `AuthContext`.
