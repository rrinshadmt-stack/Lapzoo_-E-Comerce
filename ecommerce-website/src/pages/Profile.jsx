import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password change if any password field is filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setError("Enter your current password");
        return;
      }
      if (!newPassword) {
        setError("Enter a new password");
        return;
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        return;
      }
    }

    try {
      const res = await api.patch("/auth/profile", {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setUser(res.data.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">
      <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-700">

        <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">
          👤 {user?.name}
        </h2>
        <p className="text-center text-zinc-400 mb-6">{user?.email}</p>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-5">

          <div>
            <label className="block mb-2 text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <hr className="border-gray-600" />
          <p className="text-gray-400 text-sm">Leave password fields empty if you don't want to change it</p>

          <div>
            <label className="block mb-2 text-gray-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-semibold"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}