import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return setCart([]);

    api.get("/cart")
      .then((res) => setCart(res.data.products))
      .catch(() => setCart([]));
  }, [user, loading]);

  const addToCart = async (product) => {
    if (!user) return;
    try {
      await api.post("/cart", { productId: product._id });
      setCart((prev) => [...prev, { productId: product, quantity: 1 }]);
    } catch (error) {
      if (error.response?.data?.message === "Already in cart") {
        toast.error("Already in cart");
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await api.delete(`/cart/${productId}`);
      setCart((prev) => prev.filter((p) => p.productId._id !== productId));
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  const increaseQty = async (productId) => {
    if (!user) return;
    const item = cart.find((p) => p.productId._id === productId);
    if (!item) return;
    const newQty = item.quantity + 1;
    await api.patch(`/cart/${productId}`, { quantity: newQty });
    setCart((prev) =>
      prev.map((p) =>
        p.productId._id === productId ? { ...p, quantity: newQty } : p
      )
    );
  };

  const decreaseQty = async (productId) => {
    if (!user) return;
    const item = cart.find((p) => p.productId._id === productId);
    if (!item || item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    await api.patch(`/cart/${productId}`, { quantity: newQty });
    setCart((prev) =>
      prev.map((p) =>
        p.productId._id === productId ? { ...p, quantity: newQty } : p
      )
    );
  };

  const clearCart = async () => {
    if (!user) return;
    await api.delete("/cart");
    setCart([]);
  };

  const isInCart = (productId) =>
    cart.some((p) => p.productId._id === productId);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
      isInCart,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);