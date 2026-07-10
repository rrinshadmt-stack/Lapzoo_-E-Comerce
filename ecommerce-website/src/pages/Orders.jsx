import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then((res) => setOrders(res.data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const getExpectedDelivery = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 5);
    return d.toDateString();
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/cancel/${orderId}`);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: "Cancelled" } : o)
      );
      toast.success("Order cancelled");
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl">You have no orders yet</h1>
        <Link to="/products" className="bg-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Orders 🚚</h1>

      {orders.map((order) => (
        <div key={order._id} className="mb-8 bg-zinc-900 p-5 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-zinc-400">Ordered on: {new Date(order.createdAt).toDateString()}</p>
            <p className="text-green-400">Expected delivery: {getExpectedDelivery(order.createdAt)}</p>
            <p className={`font-semibold ${
              order.status === "Cancelled" ? "text-red-500" :
              order.status === "Pending" ? "text-yellow-400" : "text-green-500"
            }`}>
              Status: {order.status}
            </p>
          </div>

          <div className="space-y-3">
            {order.products.map((item) => (
              <div key={item._id} className="flex gap-4 items-center bg-zinc-800 p-4 rounded">
                <img src={item.productId.image} alt={item.productId.name} className="w-24 h-24 object-contain" />
                <div>
                  <h3 className="font-bold">{item.productId.name}</h3>
                  <p className="text-zinc-400">₹{item.productId.price} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="font-bold text-lg">Total: ₹{order.totalAmount?.toFixed(2)}</p>
            {order.status !== "Cancelled" && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}