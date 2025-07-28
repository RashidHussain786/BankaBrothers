import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import CartSummaryPage from './pages/CartSummaryPage';
import ProductListingPage from './pages/ProductListingPage';
import LoginPage from './pages/LoginPage';
import AdminCreateUserPage from './pages/AdminCreateUserPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminOrderManagementPage from './pages/AdminOrderManagementPage';
import { useAuth } from './context/AuthContext';

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