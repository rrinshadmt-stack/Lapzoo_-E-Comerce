import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart } = useCart();

  useEffect(() => {
    setLoading(true);

    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  if (!product)
    return <div className="text-white text-center mt-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-zinc-400">{product.brand}</p>
          <p className="text-2xl font-semibold">₹{product.price}</p>
          <div className="text-zinc-400 flex justify-between">
            <span>{product.purpose}</span>
            <span className={`text-sm ${product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
              {product.stock === 0 ? "Out of Stock" : `Stock ${product.stock}`}
            </span>
          </div>

          {/* Specs Section */}
          {product.specs && Object.keys(product.specs).length > 0 ? (
            <div className="mt-4 bg-zinc-900 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Specifications</h2>
              <ul className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li
                    key={key}
                    className="flex justify-between border-b border-zinc-700 pb-1"
                  >
                    <span className="font-medium">{key}</span>
                    <span className="text-zinc-300">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-zinc-500">Specifications not available</p>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                if (isInCart(product._id)) {
                  removeFromCart(product._id);
                  toast.success("Removed from cart ❌");
                } else {
                  addToCart(product);
                  toast.success("Added to cart 🛒");
                }
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition ${isInCart(product._id)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {isInCart(product._id)
                ? "Remove from Cart"
                : "Add to Cart"}
            </button>


            <button
              onClick={() => {
                if (isInWishlist(product._id)) {
                  removeFromWishlist(product._id);

                } else {
                  addToWishlist(product);
                }
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition ${isInWishlist(product._id)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {isInWishlist(product._id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}