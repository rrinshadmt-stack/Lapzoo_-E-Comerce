import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center gap-4">
        <h2 className="text-xl">Your cart is empty 🛒</h2>
        <Link to="/products" className="bg-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const deliveryCharge = 100;
  const tax = subtotal * 0.12;
  const total = subtotal + deliveryCharge + tax;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.map((item) => (
        <div key={item.productId._id} className="flex items-center gap-6 border-b border-zinc-800 py-4 relative">
          <img src={item.productId.image} alt={item.productId.name} className="w-24 h-24 object-contain" />

          <div className="flex-1">
            <h2 className="text-lg font-semibold">{item.productId.name}</h2>
            <p className="text-zinc-400">₹{item.productId.price}</p>

            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => decreaseQty(item.productId._id)} className="px-3 py-1 bg-zinc-700 rounded">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item.productId._id)} className="px-3 py-1 bg-zinc-700 rounded">+</button>
            </div>
          </div>

          <button onClick={() => removeFromCart(item.productId._id)} className="bg-red-600 px-4 py-2 rounded absolute top-2 right-2">
            Remove
          </button>
        </div>
      ))}

      <div className="mt-8 max-w-md ml-auto bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Delivery Charge</span><span>₹{deliveryCharge.toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Tax (12%)</span><span>₹{tax.toFixed(2)}</span></div>
        <hr className="my-3 border-zinc-700" />
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        <button onClick={() => navigate("/payment")} className="mt-4 w-full bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
          Checkout
        </button>
      </div>
    </div>
  );
}