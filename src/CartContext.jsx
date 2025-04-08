import { createContext, useState, useContext, useEffect } from 'react';
import { getCartItems } from './services/cartService';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCartItems()
      .then(items => {
        setCartItems(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading cart:', err);
        setLoading(false);
      });
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}