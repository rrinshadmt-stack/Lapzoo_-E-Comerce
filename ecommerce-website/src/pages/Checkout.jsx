import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.fullName || !form.phone || !form.address) {
      alert("Please fill all fields");
      return;
    }

    // Pass checkout data to payment page
    navigate("/payment", { state: { form, cart, cartTotal } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2>Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
          />
        </div>

        <div>
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
