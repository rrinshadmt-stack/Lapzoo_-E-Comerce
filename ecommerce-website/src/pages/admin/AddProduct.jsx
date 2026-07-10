import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    purpose: "",
    image: "",
    stock: 1, 
    CPU: "",
    GPU: "",
    RAM: "",
    Storage: "",
    Display: "",
    Battery: "",
    OS: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim() || !product.price.toString.trim() ||!product.image.trim()) {
      toast.error("Name and Price,image are required");
      return;
    }

    try {
      await api.post("/admin/products", {
        name: product.name,
        brand: product.brand,
        price: Number(product.price),
        purpose: product.purpose,
        image: product.image,
        active: true,
        stock: Number(product.stock),
        specs: {
          CPU: product.CPU,
          GPU: product.GPU,
          RAM: product.RAM,
          Storage: product.Storage,
          Display: product.Display,
          Battery: product.Battery,
          OS: product.OS
        },
      });

      toast.success("Product added successfully!");
      navigate("/admin");

    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-4xl space-y-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center">
          Add New Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Product Name" className="input w-full" onChange={handleChange} />
          <input name="brand" placeholder="Brand" className="input w-full" onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" className="input w-full" onChange={handleChange} />
          <input name="purpose" placeholder="Purpose (Gaming/Student/Professional)" className="input w-full" onChange={handleChange} />
          <input name="image" placeholder="Image URL" className="input w-full md:col-span-2" onChange={handleChange} />
        </div>

        <h3 className="text-lg font-semibold mt-4">Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="CPU" placeholder="CPU" className="input w-full" onChange={handleChange} />
          <input name="GPU" placeholder="GPU" className="input w-full" onChange={handleChange} />
          <input name="RAM" placeholder="RAM" className="input w-full" onChange={handleChange} />
          <input name="Storage" placeholder="Storage" className="input w-full" onChange={handleChange} />
          <input name="Display" placeholder="Display" className="input w-full" onChange={handleChange} />
          <input name="Battery" placeholder="Battery" className="input w-full" onChange={handleChange} />
          <input name="OS" placeholder="Operating System" className="input w-full md:col-span-2" onChange={handleChange} />
          <input type="number" name="stock" placeholder="Stock"className="input w-full md:col-span-2"onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
