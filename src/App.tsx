import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import CartSummaryPage from './pages/CartSummaryPage';
import ProductListingPage from './pages/ProductListingPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/cart" element={<CartSummaryPage />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 Banka Brother. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;