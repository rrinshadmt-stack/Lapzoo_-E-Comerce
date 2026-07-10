import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState("weekly");
  const { user } = useAuth("");

  const [mostSellingProducts, setMostSellingProducts] = useState([]);
  const [returnData, setReturnData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [viewMode]);

  const fetchDashboardData = async () => {
  try {
    const usersRes = await api.get("/admin/users");
    const productsRes = await api.get("/products");
    const ordersRes = await api.get("/admin/orders");

    const users = usersRes.data;
    const products = productsRes.data;
    const orders = ordersRes.data;

    setTotalUsers(users.length);
    setTotalProducts(products.length);
    setTotalOrders(orders.length);

    const revenue = orders
      .filter(o => o.status !== "Cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    setTotalRevenue(revenue);

    // Build chart data
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let startDate;

    if (viewMode === "weekly") {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 6);
    } else {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    let dateMap = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = new Date(d).toISOString().split("T")[0];
      dateMap[key] = {
        name: new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        orders: 0,
        revenue: 0,
        fullDate: new Date(d),
      };
    }

    let productSalesMap = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const normalized = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      const key = normalized.toISOString().split("T")[0];

      if (dateMap[key] && order.status !== "Cancelled") {
        dateMap[key].orders += 1;
        dateMap[key].revenue += order.totalAmount || 0;
      }

      // Most selling products
      order.products?.forEach((item) => {
        const name = item.productId?.name;
        if (!name) return;
        productSalesMap[name] = (productSalesMap[name] || 0) + item.quantity;
      });
    });

    const sortedData = Object.values(dateMap).sort((a, b) => a.fullDate - b.fullDate);

    const sortedProducts = Object.entries(productSalesMap)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setChartData(sortedData);
    setMostSellingProducts(sortedProducts);
    // Track cancelled orders per day
let cancelMap = {};
orders.forEach((order) => {
  if (order.status !== "Cancelled") return;
  const key = new Date(order.createdAt).toISOString().split("T")[0];
  if (dateMap[key]) cancelMap[key] = (cancelMap[key] || 0) + 1;
});

setReturnData(
  Object.keys(dateMap).map((key) => ({
    name: dateMap[key].name,
    returns: cancelMap[key] || 0,
  }))
);

  } catch (error) {
    console.log("Dashboard error:", error);
  }
};

  return (
    <>
      <div className="flex justify-between bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white">ADMIN</h1>
        <h1 className="text-3xl font-bold text-white">👤  {user?.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Stat title="Total Products" value={totalProducts} />
        <Stat title="Total Orders" value={totalOrders} />
        <Stat title="Total Users" value={totalUsers} />
        <Stat title="Total Revenue" value={`₹${totalRevenue}`} />
      </div>

      <div className="bg-[#1e293b] mt-8 p-6 rounded-xl shadow-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {viewMode === "weekly" ? "Weekly" : "Monthly"} Orders & Revenue
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-1 rounded ${
                viewMode === "weekly"
                  ? "bg-purple-600"
                  : "bg-gray-700"
              }`}
            >
              Weekly
            </button>

            <button
              onClick={() => setViewMode("monthly")}
              className={`px-4 py-1 rounded ${
                viewMode === "monthly"
                  ? "bg-purple-600"
                  : "bg-gray-700"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="w-full h-[400px]">
          <ResponsiveContainer>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
    
    <XAxis dataKey="name" stroke="#9CA3AF" />

    {/* LEFT Y AXIS (Orders) */}
    <YAxis
      yAxisId="left"
      stroke="#8b5cf6"
      allowDecimals={false}
    />

    {/* RIGHT Y AXIS (Revenue) */}
    <YAxis
      yAxisId="right"
      orientation="right"
      stroke="#6366f1"
    />

    <Tooltip
      contentStyle={{
        backgroundColor: "#111827",
        border: "none",
      }}
    />

    <Legend />

    <Line
      yAxisId="left"
      type="monotone"
      dataKey="orders"
      stroke="#8b5cf6"
      strokeWidth={3}
      activeDot={{ r: 6 }}
    />

    <Line
      yAxisId="right"
      type="monotone"
      dataKey="revenue"
      stroke="#6366f1"
      strokeWidth={3}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1e293b] mt-8 p-6 rounded-xl shadow-md text-white">
        <h3 className="text-lg font-semibold mb-4">
          Most Selling Products
        </h3>

        {mostSellingProducts.map((product, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-gray-700 py-2"
          >
            <span>{product.name}</span>
            <span>{product.quantity} sold</span>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b] mt-8 p-6 rounded-xl shadow-md text-white">
        <h3 className="text-lg font-semibold mb-4">
          Cancelled Orders
        </h3>

        <div className="w-full h-[300px]">
          <ResponsiveContainer>
            <LineChart data={returnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "none",
                }}
              />
              <Legend />

              <Line
                type="monotone"
                dataKey="returns"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-xl shadow-md text-white">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}