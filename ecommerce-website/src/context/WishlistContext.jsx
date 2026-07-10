import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, loading } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return setWishlist([]);

    api.get("/wishlist")
      .then((res) => setWishlist(res.data.products))
      .catch(() => setWishlist([]));
  }, [user, loading]);

  const addToWishlist = async (product) => {
    if (!user) return;
    try {
      await api.post("/wishlist", { productId: product._id });
      setWishlist((prev) => [...prev, product]);
    } catch (error) {
      console.error("Add to wishlist failed:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Remove from wishlist failed:", error);
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);