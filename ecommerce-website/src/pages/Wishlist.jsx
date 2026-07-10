import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl">Your wishlist is empty</h1>
        <Link to="/products" className="bg-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="bg-zinc-900 p-4 rounded-xl shadow-lg relative">
            <button
              onClick={() => removeFromWishlist(product._id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm font-bold z-10"
            >
              Remove
            </button>
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
              <h2 className="text-lg font-bold mt-2">{product.name}</h2>
              <p className="text-zinc-400">₹{product.price}</p>
              <p className="text-zinc-300 mt-1">{product.purpose}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}