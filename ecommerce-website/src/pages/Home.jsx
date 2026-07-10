import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductSlider from "../components/ProductSlider";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  api
    .get("/products")
    .then((res) => {
      console.log("HOME PRODUCTS:", res.data); // keep this temporarily
      setProducts(res.data); // ❌ NO FILTER
    })
    .catch((err) => console.error(err));
}, []);


  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  const randomProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black px-4">
      <div className="w-full max-w-6xl mx-auto pt-8">
        <div className="bg-black rounded-2xl shadow-2xl p-8">

          {/* HERO SECTION */}
          <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 grid md:grid-cols-2 gap-10 items-center">

            <div>
              <h1 className="text-5xl font-extrabold text-white mb-4">
                Find your perfect laptop
              </h1>

              <p className="text-zinc-300 mb-8 text-lg max-w-xl">
                Explore laptops for gaming, work, study, and creativity.
                Compare brands, prices, and performance — all in one place.
              </p>

              <Link
                to="/products"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                Shop Now
              </Link>
            </div>

            <div>
              <ProductSlider />
            </div>
          </div>

          {/* FEATURED PRODUCTS */}
          <div className="mt-12 bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Top Selling Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {randomProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}

                  className="bg-black p-5 rounded-xl border border-zinc-800 hover:border-blue-500 transition hover:scale-105"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-36 object-contain mb-4"
                  />

                  <h3 className="text-white font-semibold mb-2 truncate">
                    {product.name}
                  </h3>

                  <p className="text-blue-400 font-bold">
                    ₹{product.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* BRANDS */}
          <div className="mt-12 bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Brands
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to={`/products?brand=${brand}`}
                  className="bg-black p-6 rounded-xl border border-zinc-800 font-semibold transition hover:scale-105 text-white hover:border-blue-500"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* HOW IT WORKS */}
       <div className="mt-14 bg-zinc-900 border border-zinc-800 rounded-2xl p-9 shadow-xl">
  <h2 className="text-3xl font-bold text-white mb-2 text-center">
    How It Works
  </h2>
  <p className="text-zinc-400 text-center mb-8">Simple steps to get your perfect laptop</p>

  <div className="grid md:grid-cols-4 gap-6 text-left relative">

    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-blue-500 transition hover:scale-105 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl mb-4">
        🔍
      </div>
      <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Step 1</span>
      <h3 className="text-white font-semibold mb-2">Find Your Product</h3>
      <p className="text-zinc-400 text-sm">Browse through a wide range of laptops filtered by brand, price and specs.</p>
    </div>

    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-pink-500 transition hover:scale-105 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center text-2xl mb-4">
        🛒
      </div>
      <span className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-1">Step 2</span>
      <h3 className="text-white font-semibold mb-2">Add to Cart</h3>
      <p className="text-zinc-400 text-sm">Add your favorite laptops to the cart and review your selection anytime.</p>
    </div>

    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-green-500 transition hover:scale-105 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-2xl mb-4">
        🔒
      </div>
      <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Step 3</span>
      <h3 className="text-white font-semibold mb-2">Secure Payment</h3>
      <p className="text-zinc-400 text-sm">Complete your purchase securely via Razorpay with UPI, cards and more.</p>
    </div>

    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-yellow-400 transition hover:scale-105 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center text-2xl mb-4">
        🚚
      </div>
      <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Step 4</span>
      <h3 className="text-white font-semibold mb-2">Fast Delivery</h3>
      <p className="text-zinc-400 text-sm">Get your laptop delivered to your doorstep within 3 business days.</p>
    </div>

  </div>
</div>

        </div>
      </div>
    </div>
  );
}
