import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import Search from "../components/Search";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [sortBy, setSortBy] = useState("featured");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 300000,
    brand: "",
    purpose: [],
    processor: [],
    ram: [],
  });

  const location = useLocation();

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const activeProducts = res.data.filter((p) => p.active);
        setProducts(activeProducts);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const brandFromURL = queryParams.get("brand");
    if (brandFromURL) {
      setFilters((prev) => ({ ...prev, brand: brandFromURL }));
    }
  }, [location.search]);

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  let filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    .filter((p) => !filters.brand || p.brand === filters.brand)
    .filter((p) => filters.purpose.length === 0 || filters.purpose.includes(p.purpose))
    .filter((p) => filters.processor.length === 0 || filters.processor.some(cpu => p.specs?.CPU?.includes(cpu)))
    .filter((p) => filters.ram.length === 0 || filters.ram.some(ram => p.specs?.RAM?.includes(ram)));

  if (sortBy === "low") filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortBy === "high") filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

  if (!products.length)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex gap-4 items-center">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-zinc-800 px-4 py-2 rounded-lg">
            <option value="featured">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
          <button onClick={() => setShowFilter(true)} className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition">
            Filter
          </button>
        </div>
      </div>

      <div className="mb-6">
        <Search search={search} setSearch={setSearch} />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-zinc-400 mt-10 text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-zinc-900 p-4 rounded-xl shadow-lg relative cursor-pointer">
              <Link to={`/product/${product._id}`} state={{ product }}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
                <h2 className="text-white text-lg font-bold mt-2">{product.name}</h2>
                <div className="text-zinc-400 flex justify-between">
                  <span>₹{product.price}</span>
                  <span className={`text-sm ${product.stock === 0 ? "text-red-500" : "text-green-500"}`}>
                    {product.stock === 0 ? "Out of Stock" : `Stock ${product.stock}`}
                  </span>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInWishlist(product._id)) removeFromWishlist(product._id);
                  else addToWishlist(product);
                }}
                className={`absolute top-2 right-2 p-2 rounded-full transition ${
                  isInWishlist(product._id) ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}

      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-zinc-900 w-[500px] h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilter(false)} className="text-red-500">Close</button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Price: ₹{filters.minPrice} - ₹{filters.maxPrice}</h3>
              <input type="range" min="0" max="300000" value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="w-full" />
              <input type="range" min="0" max="300000" value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full" />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Brand</h3>
              <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full p-2 bg-zinc-800 rounded">
                <option value="">All Brands</option>
                {brands.map((brand, index) => <option key={index} value={brand}>{brand}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Purpose</h3>
              {["Gaming", "Professional", "Student"].map((p) => (
                <label key={p} className="block">
                  <input type="checkbox" value={p} checked={filters.purpose.includes(p)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...filters.purpose, p]
                        : filters.purpose.filter((item) => item !== p);
                      setFilters({ ...filters, purpose: updated });
                    }} />{" "}{p}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Processor</h3>
              {["i5", "i7", "Ryzen 5", "Ryzen 7"].map((cpu) => (
                <label key={cpu} className="block">
                  <input type="checkbox" value={cpu} checked={filters.processor.includes(cpu)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...filters.processor, cpu]
                        : filters.processor.filter((item) => item !== cpu);
                      setFilters({ ...filters, processor: updated });
                    }} />{" "}{cpu}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">RAM</h3>
              {["4GB", "8GB", "16GB", "32GB"].map((ram) => (
                <label key={ram} className="block">
                  <input type="checkbox" value={ram} checked={filters.ram.includes(ram)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...filters.ram, ram]
                        : filters.ram.filter((item) => item !== ram);
                      setFilters({ ...filters, ram: updated });
                    }} />{" "}{ram}
                </label>
              ))}
            </div>

            <button
              onClick={() => setFilters({ minPrice: 0, maxPrice: 300000, brand: "", purpose: [], processor: [], ram: [] })}
              className="bg-red-600 w-full py-2 rounded mt-4"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}