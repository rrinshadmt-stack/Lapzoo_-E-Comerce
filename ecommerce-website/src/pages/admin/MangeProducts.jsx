import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { Link } from "react-router-dom";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function ManageProducts() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (err) {
      toast.error("Failed to load products");
      return [];
    }
  };

  const { visibleData: products, lastElementRef, reload } =
    useInfiniteScroll(fetchProducts, 10);

  const deleteProduct = async (id) => {
  if (!window.confirm("Delete this product?")) return;
  try {
    await api.delete(`/admin/products/${id}`);
    toast.success("Product deleted");
    reload();
  } catch { toast.error("Delete failed"); }
};

const toggleActive = async (product) => {
  try {
    await api.patch(`/admin/products/${product._id}`, { active: !product.active });
    toast.success(product.active ? "Product hidden" : "Product visible");
    reload();
  } catch { toast.error("Failed to update"); }
};

const saveChanges = async () => {
  try {
    await api.put(`/admin/products/${editingProduct._id}`, {
      ...editingProduct,
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
    });
    toast.success("Product updated");
    setShowModal(false);
    reload();
  } catch { toast.error("Failed to update product"); }
};
const openEditModal = (product) => {
  setEditingProduct({
    ...product,
    specs: product.specs || {},
  });
  setShowModal(true);
};

const handleEditChange = (e) => {
  const { name, value } = e.target;

  if (name.startsWith("specs.")) {
    const key = name.split(".")[1];

    setEditingProduct((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value,
      },
    }));
  } else {
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Products
            </h1>
            <p className="text-gray-500 text-sm">
              View, edit, and manage your store products
            </p>
          </div>

          <Link
            to="/admin/add-product"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300 shadow-md"
          >
            Add Products
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Active</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.map((product, index) => {
                const isLast = products.length === index + 1;

                return (
                  <tr
                    ref={isLast ? lastElementRef : null}
                    key={product._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      ₹{product.price}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.stock > 0
                        ? product.stock
                        : "Out of Stock"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Edit Product
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={editingProduct.name}
                placeholder="Product Name"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="brand"
                value={editingProduct.brand}
                placeholder="Brand"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                type="number"
                name="price"
                value={editingProduct.price}
                placeholder="Price"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="purpose"
                value={editingProduct.purpose}
                placeholder="Purpose"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="image"
                value={editingProduct.image}
                placeholder="Image URL"
                className="input w-full md:col-span-2"
                onChange={handleEditChange}
              />

              <input
                type="number"
                name="stock"
                value={editingProduct.stock}
                placeholder="Stock"
                className="input w-full md:col-span-2"
                onChange={handleEditChange}
              />

              {/* Specs */}
              <input
                name="specs.CPU"
                value={editingProduct.specs?.CPU || ""}
                placeholder="CPU"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="specs.GPU"
                value={editingProduct.specs?.GPU || ""}
                placeholder="GPU"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="specs.RAM"
                value={editingProduct.specs?.RAM || ""}
                placeholder="RAM"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="specs.Storage"
                value={editingProduct.specs?.Storage || ""}
                placeholder="Storage"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="specs.Display"
                value={editingProduct.specs?.Display || ""}
                placeholder="Display"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="specs.Battery"
                value={editingProduct.specs?.Battery || ""}
                placeholder="Battery"
                className="input w-full"
                onChange={handleEditChange}
              />

              <input
                name="specs.OS"
                value={editingProduct.specs?.OS || ""}
                placeholder="Operating System"
                className="input w-full"
                onChange={handleEditChange}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}