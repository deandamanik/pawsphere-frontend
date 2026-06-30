import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const KEY = "pawsphere_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((items) => {
      const found = items.find((i) => i.id === product.id);
      if (found) {
        return items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...items, { id: product.id, name: product.name, price: product.price, oldPrice: product.oldPrice || null, image: product.image, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) =>
    setCart((items) => items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)));

  const removeItem = (id) => setCart((items) => items.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}