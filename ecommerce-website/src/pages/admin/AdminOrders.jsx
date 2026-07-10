import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, {
        status: "Cancelled",
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 text-white rounded-3xl p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Orders Details
      </h1>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="mb-6 bg-[#0f172a] p-6 rounded-xl shadow-lg border border-zinc-800"
          >
            <div className="flex justify-between mb-4">
              <div>
                <p>Name: {order.userId?.name}</p>
                <p>Email: {order.userId?.email}</p>
                <p className="text-zinc-400">
                  Order ID: {order._id}
                </p>
                <p className="text-sm text-zinc-400">
                  Order Date:{" "}
                  {new Date(order.createdAt).toDateString()}
                </p>
                <p className="text-green-500">
                  Total: ₹{order.totalAmount}
                </p>
              </div>

              <span className="text-yellow-400">
                {order.status}
              </span>
            </div>

            {order.products?.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 items-center bg-zinc-800 p-4 rounded mb-3"
              >
                <img
                  src={item.productId?.image}
                  alt={item.productId?.name}
                  className="w-20 h-20 object-contain bg-white rounded"
                />

                <div>
                  <h3>{item.productId?.name}</h3>
                  <p>
                    ₹{item.productId?.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl">Shipping Address</h2>
                <p>{order.address}</p>
                <p>Phone: {order.phone}</p>
                <p>Pincode: {order.pincode}</p>
              </div>

              {order.status !== "Cancelled" && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;