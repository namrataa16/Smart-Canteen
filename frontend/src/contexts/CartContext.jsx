import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

// Helper to safely parse populated cart items from the backend
const parseCartItems = (data) => {
  if (!data || !data.items || !Array.isArray(data.items)) return [];
  return data.items
    .filter(i => i.foodItemId && typeof i.foodItemId === 'object') // skip deleted/null items
    .map(i => ({
      _id: i.foodItemId._id,
      foodItemId: i.foodItemId._id,
      name: i.foodItemId.name || 'Unknown Item',
      price: i.foodItemId.price || 0,
      image: i.foodItemId.image || '',
      category: i.foodItemId.category || '',
      description: i.foodItemId.description || '',
      availability: i.foodItemId.availability !== undefined ? i.foodItemId.availability : true,
      quantity: i.quantity || 1,
    }));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch Cart from Server on Mount/User Change
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { data } = await api.get('/api/cart');
          setCartItems(parseCartItems(data));
        } catch (error) {
          console.error("Cart fetch error:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (foodItem) => {
    if (!user) return alert("Please login to add to cart!");

    try {
      const { data } = await api.post('/api/cart/add', {
        foodItemId: foodItem._id,
        quantity: 1
      });
      setCartItems(parseCartItems(data));
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const updateQuantity = async (foodItemId, newQuantity) => {
    if (!user) return;
    try {
      const { data } = await api.put('/api/cart/update', {
        foodItemId,
        quantity: newQuantity
      });
      setCartItems(parseCartItems(data));
    } catch (error) {
      console.error("Update cart error:", error);
    }
  };

  const removeFromCart = async (foodItemId) => {
    if (!user) return;
    try {
      const { data } = await api.delete('/api/cart/remove', {
        data: { foodItemId }
      });
      setCartItems(parseCartItems(data));
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const clearCart = async () => {
    // Clear locally immediately for snappy UI
    setCartItems([]);
    // Also clear on backend
    if (user) {
      try {
        await api.delete('/api/cart/clear');
      } catch (error) {
        console.error("Clear cart error:", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
