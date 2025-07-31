import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, itemsPerPack?: string, specialInstructions?: string) => void;
  removeFromCart: (productId: number, itemsPerPack?: string, specialInstructions?: string) => void;
  updateCartItemQuantity: (productId: number, newQuantity: number, itemsPerPack?: string, specialInstructions?: string) => void;
  clearCart: () => void;
  totalItemsInCart: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bankaBrotherCart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, itemsPerPack?: string, specialInstructions?: string) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.itemsPerPack === itemsPerPack && item.specialInstructions === specialInstructions
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity, itemsPerPack, specialInstructions }];
      }
    });
  };

  const removeFromCart = (productId: number, itemsPerPack?: string, specialInstructions?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.itemsPerPack === itemsPerPack && item.specialInstructions === specialInstructions)
      )
    );
  };

  const updateCartItemQuantity = (productId: number, newQuantity: number, itemsPerPack?: string, specialInstructions?: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.itemsPerPack === itemsPerPack && item.specialInstructions === specialInstructions
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    totalItemsInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};