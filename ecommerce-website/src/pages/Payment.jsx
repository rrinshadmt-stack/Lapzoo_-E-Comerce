import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Payment() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName]       = useState(user?.name || "");
  const [email, setEmail]     = useState(user?.email || "");
  const [phone, setPhone]     = useState(user?.phone || "");
  const [city, setCity]       = useState(user?.city || "");
  const [state, setState]     = useState(user?.state || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [address, setAddress] = useState(user?.address || "");
  const [error, setError]     = useState("");

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h2 className="text-xl">Your cart is empty 🛒</h2>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, i) => sum + i.productId.price * i.quantity, 0);
  const deliveryCharge = 100;
  const tax = subtotal * 0.12;
  const total = subtotal + deliveryCharge + tax;

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !city || !state || !pincode || !address) {
      setError("All fields are required.");
      return;
    }

    try {
      //  create order
      const { data } = await api.post("/orders/create", { amount: total });

      // open checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Lapzoo",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Step 3 — verify payment
            await api.post("/orders/verify", {
              ...response,
              address, city, state, pincode, phone,
            });
            clearCart();
            toast.success("Payment successful! Order placed.");
            navigate("/orders");
          } catch {
            toast.error("Payment verification failed.");
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <form onSubmit={handlePayment} className="space-y-6 bg-zinc-900 p-6 rounded-xl shadow-lg">
        {error && <div className="bg-red-600 text-white p-2 rounded">{error}</div>}

        <h2 className="text-xl font-semibold">Delivery Details</h2>

        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />
        <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />
        <input type="text" placeholder="PIN-CODE" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />
        <textarea placeholder="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 rounded bg-zinc-800" />

        <div className="p-4 bg-zinc-800 rounded">
          <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryCharge}</span></div>
          <div className="flex justify-between"><span>Tax (12%)</span><span>₹{tax.toFixed(2)}</span></div>
          <hr className="my-2 border-zinc-700" />
          <div className="flex justify-between font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>

        <button type="submit" className="w-full bg-green-600 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Pay ₹{total.toFixed(2)}
        </button>
      </form>
    </div>
  );
}