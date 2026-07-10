import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const toggleBlock = async (e, user) => {
    e.stopPropagation();
    try {
      const res = await api.patch(`/admin/users/${user._id}/block`);
      toast.success(res.data.message);
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, isBlock: !u.isBlock } : u)
      );
    } catch {
      toast.error("Failed to update user");
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg text-white">Loading users...</div>;

  return (
    <div className="p-6 overflow-x-auto bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">All Users</h1>
      <table className="min-w-full border border-gray-700 shadow-xl rounded-xl overflow-hidden bg-gray-800 text-gray-200">
        <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}
              onClick={() => navigate(`/admin/users/${user._id}`)}
              className={`cursor-pointer transition hover:bg-gray-900 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} border-b border-gray-700`}
            >
              <td className="px-4 py-3 font-medium text-white">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 capitalize">{user.role}</td>
              <td className={`px-4 py-3 font-semibold ${user.isBlock ? "text-red-400" : "text-green-400"}`}>
                {user.isBlock ? "Blocked" : "Active"}
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={(e) => toggleBlock(e, user)}
                  className={`px-3 py-1 rounded-md font-semibold text-white transition ${user.isBlock ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                  {user.isBlock ? "Unblock" : "Block"}
                </button>
                <button onClick={(e) => deleteUser(e, user._id)}
                  className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;