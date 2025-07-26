import { useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'bankaBrotherCart';

export const useCart = () => {
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

  const addToCart = (product: Product, quantity: number, note: string, itemsPerPack: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.note === note && item.itemsPerPack === itemsPerPack
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity, note, itemsPerPack }];
      }
    });
  };

  const removeFromCart = (productId: number, note: string, itemsPerPack: number) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.note === note && item.itemsPerPack === itemsPerPack)
      )
    );
  };

  const updateCartItemQuantity = (productId: number, newQuantity: number, note: string, itemsPerPack: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.note === note && item.itemsPerPack === itemsPerPack
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    totalItemsInCart,
  };
};