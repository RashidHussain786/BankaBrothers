import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { Trash2, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import { orderService } from '../services/orderService';
import { OrderData } from '../types';
import { useAuth } from '../context/AuthContext';
import { getAllCustomers } from '../services/customerService';
import { Customer } from '../types/customer';
import AddCustomerModal from '../components/AddCustomerModal';

const CartSummaryPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, totalItemsInCart, clearCart } = useCart();
  const { token, user } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<Customer | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { customers: fetchedCustomers } = await getAllCustomers();
      setCustomers(fetchedCustomers);
      setFilteredCustomers(fetchedCustomers); // Initialize filtered customers with all customers
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      setFilteredCustomers(
        customers.filter(
          (customer) =>
            customer.shopName?.toLowerCase().includes(term.toLowerCase()) ||
            customer.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers(customers);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setSelectedCustomerDetails(customer);
    setSearchTerm(customer.shopName || customer.name); // Display selected customer's name in search box
    setFilteredCustomers([]); // Clear filtered results
  };

  const handleAddCustomerSuccess = () => {
    fetchCustomers(); // Re-fetch customers after a new one is added
    setIsAddCustomerModalOpen(false);
  };

  const handleQuantityChange = (productId: number, newQuantity: number, itemsPerPack?: string, specialInstructions?: string) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity, itemsPerPack, specialInstructions);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!selectedCustomerId) {
      alert('Please select a customer.');
      return;
    }

    if (!user?.id) {
      alert('User not authenticated. Please log in to place an order.');
      return;
    }

    const orderData: OrderData = {
      userId: user.id,
      customerId: selectedCustomerId,
      cartItems: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtOrder: item.variant.price,
        itemsPerPack: item.itemsPerPack,
        specialInstructions: item.specialInstructions,
      })),
    };

    try {
      if (!token) {
        throw new Error('Authentication token not found.');
      }
      const result = await orderService.submitOrder(orderData, token);
      setOrderId(result.orderId);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

        {orderPlaced ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-medium text-green-600 mb-4">Order submitted successfully!</h3>
            <p className="text-lg text-gray-700 mb-4">Your Order ID: <span className="font-bold">{orderId}</span></p>
            <p className="text-gray-600">Thank you for your order. We will contact you shortly.</p>
            <Link
              to="/"
              className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cart Items ({totalItemsInCart})</h2>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.specialInstructions}-${item.itemsPerPack}`} className="flex items-center py-4">

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.company} - {item.variant.unitSize}</p>
                      {item.specialInstructions && <p className="text-sm text-gray-500 italic">Instructions: {item.specialInstructions}</p>}
                      <p className="text-sm text-gray-500">Items per Pack: {item.itemsPerPack}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.itemsPerPack, item.specialInstructions)}
                        className="text-gray-600 hover:text-gray-800"
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-6 w-6" />
                      </button>
                      <span className="text-lg font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.itemsPerPack, item.specialInstructions)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <PlusCircle className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.itemsPerPack, item.specialInstructions)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Customer</h2>
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="customerSearch" className="block text-sm font-medium text-gray-700">Search Customer by Shop Name or Name</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      id="customerSearch"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search by shop name or customer name"
                    />
                    <button
                      onClick={() => setIsAddCustomerModalOpen(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm whitespace-nowrap"
                    >
                      Add New
                    </button>
                  </div>
                  {searchTerm && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          {customer.shopName} ({customer.name})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedCustomerDetails && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Details:</h3>
                    <p className="text-sm text-gray-700"><strong>Name:</strong> {selectedCustomerDetails.name}</p>
                    <p className="text-sm text-gray-700"><strong>Mobile:</strong> {selectedCustomerDetails.mobile}</p>
                    <p className="text-sm text-gray-700"><strong>Address:</strong> {selectedCustomerDetails.address || 'N/A'}</p>
                    <p className="text-sm text-gray-700"><strong>Shop Name:</strong> {selectedCustomerDetails.shopName || 'N/A'}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 Banka Brother. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {isAddCustomerModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddCustomerModalOpen(false)}
          onCustomerAdded={handleAddCustomerSuccess}
        />
      )}
    </div>
  );
};

export default CartSummaryPage;