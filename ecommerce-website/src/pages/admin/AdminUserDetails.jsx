import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminUserDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(res => setData(res.data));
  }, [id]);

  if (!data) return <div className="text-white text-center mt-20">Loading...</div>;

  const { user, orders, cart, wishlist } = data;

  return (
    <div className="min-h-screen bg-gray-700 rounded-3xl text-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">{user.name}</h1>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8 space-y-3">
        <p><span className="text-gray-400">Email:</span> {user.email}</p>
        <p><span className="text-gray-400">Role:</span> {user.role}</p>
        <p className={`font-semibold ${user.isBlock ? "text-red-400" : "text-green-400"}`}>
          {user.isBlock ? "Blocked User" : "Active User"}
        </p>
      </div>

      {/* Orders */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        {orders?.length > 0 ? orders.map((order) => (
          <div key={order._id} className="p-5 rounded-xl mb-4 bg-gray-800">
            <p className="font-semibold">Order #{order._id}</p>
            <p className={`mt-1 ${order.status === "Cancelled" ? "text-red-400" : order.status === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
              Status: {order.status}
            </p>
            <p className="text-gray-400">Total: ₹{order.totalAmount}</p>
            <div className="mt-3 space-y-3">
              {order.products.map((item) => (
                <div key={item._id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                  <div>{item.productId?.name} | Qty: {item.quantity}</div>
                  <img src={item.productId?.image} alt={item.productId?.name} className="w-20 h-20 object-contain" />
                </div>
              ))}
            </div>
          </div>
        )) : <p className="text-gray-500">No orders</p>}
      </div>

      {/* Wishlist */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
        {wishlist?.length > 0 ? (
          <ul className="space-y-3">
            {wishlist.map((product) => (
              <li key={product._id} className="p-3 rounded-lg flex justify-between items-center bg-gray-800">
                <span>{product.name}</span>
                <img src={product.image} alt={product.name} className="w-20 h-20 object-contain" />
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500">No wishlist items</p>}
      </div>

      {/* Cart */}
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {cart?.length > 0 ? (
          <ul className="space-y-3">
            {cart.map((item, index) => (
              <li key={index} className="p-3 rounded-lg flex justify-between items-center bg-gray-800">
                <div>{item.productId?.name} | Qty: {item.quantity}</div>
                <img src={item.productId?.image} alt={item.productId?.name} className="w-20 h-20 object-contain" />
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500">Cart is empty</p>}
      </div>
    </div>
  );
};

export default AdminUserDetails;