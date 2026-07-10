import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaShoppingCart, FaTruck, FaUser } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { cartCount } = useCart();

  const [showAccount, setShowAccount] = useState(false);

  const handleLogout = () => {
    logout();
    setShowAccount(false);
    navigate("/login");
  };

  const requireLogin = (path) => {
    if (!user) navigate("/login");
    else navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-zinc-800 text-white px-8 py-4 flex justify-between items-center shadow-lg">

      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold tracking-wide">
        LAP<span className="text-blue-500">ZO</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-2">
        <Link to="/"
          className="text-zinc-100 hover:text-white hover:bg-zinc-800 px-4 py-2 rounded-lg transition font-medium text-base">
          HOME
        </Link>
        <Link to="/products"
          className="text-zinc-100 hover:text-white hover:bg-zinc-800 px-4 py-2 rounded-lg transition font-medium text-base">
          PRODUCTS
        </Link>
      </div>

      {/* Icons + Account */}
      <div className="flex items-center gap-2">

        {/* Wishlist */}
        <button onClick={() => requireLogin("/wishlist")}
          className="relative flex items-center justify-center w-10 h-10 rounded-lg text-zinc-100 hover:text-pink-500 hover:bg-zinc-800 transition">
          <FaHeart size={20} />
          {user && wishlist.length > 0 && (
            <span className="absolute top-1 right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Cart */}
        <button onClick={() => requireLogin("/cart")}
          className="relative flex items-center justify-center w-10 h-10 rounded-lg text-zinc-100 hover:text-blue-400 hover:bg-zinc-800 transition">
          <FaShoppingCart size={20} />
          {user && cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        {/* Orders */}
        <button onClick={() => requireLogin("/orders")}
          className="relative flex items-center justify-center w-10 h-10 rounded-lg text-zinc-100 hover:text-green-400 hover:bg-zinc-800 transition">
          <FaTruck size={20} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-700 mx-1" />

        {/* Account */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowAccount(!showAccount)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-zinc-300 text-sm font-medium">{user.name?.split(" ")[0]}</span>
            </button>

            {showAccount && (
              <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-700">
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { navigate("/profile"); setShowAccount(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                >
                  <FaUser size={12} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition ml-1"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}