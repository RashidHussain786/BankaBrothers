import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { Trash2, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import { orderService } from '../services/orderService';
import { OrderData } from '../types';
const CartSummaryPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, totalItemsInCart, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    address: '',
  });

  const validateForm = () => {
    const newErrors = { name: '', mobile: '', address: '' };
    let isValid = true;

    if (!customerName.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!mobileNumber.trim()) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
      isValid = false;
    }

    if (!deliveryAddress.trim()) {
      newErrors.address = 'Delivery address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuantityChange = (productId: number, newQuantity: number, note: string, itemsPerPack: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity, note, itemsPerPack);
  };



  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (validateForm()) {
      const orderData: OrderData = {
        customerInfo: {
          name: customerName,
          mobile: mobileNumber,
          address: deliveryAddress,
          deliveryTime: preferredDeliveryTime,
          additionalNote: additionalNote,
        },
        cartItems: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          unitSize: item.unitSize,
          itemsPerPack: item.itemsPerPack,
          note: item.note,
        })),
      };

      try {
        const result = await orderService.submitOrder(orderData);
        setOrderId(result.orderId);
        setOrderPlaced(true);
        clearCart();
      } catch (error) {
        console.error('Error placing order:', error);
        alert(`Failed to place order: ${error}`);
      }
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
                  <div key={`${item.id}-${item.note}-${item.itemsPerPack}`} className="flex items-center py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.company} - {item.unitSize}</p>
                      {item.note && <p className="text-sm text-gray-500 italic">Note: {item.note}</p>}
                      <p className="text-sm text-gray-500">Items per Pack: {item.itemsPerPack}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.note || '', item.itemsPerPack)}
                        className="text-gray-600 hover:text-gray-800"
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-6 w-6" />
                      </button>
                      <span className="text-lg font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.note || '', item.itemsPerPack)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <PlusCircle className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.note || '', item.itemsPerPack)}
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Information</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    maxLength={10}
                  />
                  {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                </div>
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address <span className="text-red-500">*</span></label>
                  <textarea
                    id="deliveryAddress"
                    rows={3}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="preferredDeliveryTime" className="block text-sm font-medium text-gray-700">Preferred Delivery Time (Optional)</label>
                  <input
                    type="text"
                    id="preferredDeliveryTime"
                    value={preferredDeliveryTime}
                    onChange={(e) => setPreferredDeliveryTime(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 9 AM - 12 PM"
                  />
                </div>
                <div>
                  <label htmlFor="additionalNote" className="block text-sm font-medium text-gray-700">Additional Note (Optional)</label>
                  <textarea
                    id="additionalNote"
                    rows={3}
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 'Leave at the door', 'Call before arriving'"
                  ></textarea>
                </div>
              </form>

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
    </div>
  );
};

export default CartSummaryPage;