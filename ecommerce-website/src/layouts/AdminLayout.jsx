import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout} = useAuth();

  const linkClass =
    "px-3 py-2 rounded-lg transition";

  const activeClass =
    "bg-purple-600 text-white";

  const inactiveClass =
    "hover:bg-purple-600/20 hover:text-purple-400";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    navigate("/login");
  };

  return (
  <div className="min-h-screen flex bg-[#0f172a] text-white">

    {/* Sidebar */}
    <div className="w-64 bg-[#111827] p-6 fixed h-screen">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">
        Admin Panel
      </h2>

      <nav className="flex flex-col space-y-3">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/add-product"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Add Product
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Manage Products
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Orders
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold text-left"
        >
          Logout
        </button>

      </nav>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-8 ml-64 overflow-y-auto">
      <Outlet />
    </div>

  </div>
);
}
