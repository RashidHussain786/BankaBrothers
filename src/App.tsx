import Header from './features/shared/components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import CartSummaryPage from './features/cart/pages/CartSummaryPage';
import ProductListingPage from './features/products/pages/ProductListingPage';
import LoginPage from './features/auth/pages/LoginPage';
import AdminCreateUserPage from './features/users/pages/AdminCreateUserPage';
import AdminUserManagementPage from './features/users/pages/AdminUserManagementPage';
import AdminOrderManagementPage from './features/orders/pages/AdminOrderManagementPage';
import CustomerManagementPage from './features/customers/pages/CustomerManagementPage';
import AnalyticsDashboardPage from './features/analytics/pages/AnalyticsDashboardPage';
import { useAuth } from './features/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Routes>
        <Route path="/" element={<PrivateRoute><ProductListingPage /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartSummaryPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/create-user" element={<PrivateRoute><AdminCreateUserPage /></PrivateRoute>} />
        <Route path="/admin/user-management" element={<PrivateRoute><AdminUserManagementPage /></PrivateRoute>} />
        <Route path="/admin/order-management" element={<PrivateRoute><AdminOrderManagementPage /></PrivateRoute>} />
        <Route path="/admin/customer-management" element={<PrivateRoute><CustomerManagementPage /></PrivateRoute>} />
        <Route path="/admin/analytics" element={<PrivateRoute><AnalyticsDashboardPage /></PrivateRoute>} />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 Banka Brothers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;