import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const user = await login(email, password);

      
      if (user.isBlock) {
        toast.error("This user is blocked");
        return;
      }

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      toast.success("Login Successful", { duration: 1000 });

    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-lg w-full max-w-sm shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded bg-zinc-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Login
        </button>

        <p className="text-sm text-zinc-400 text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>

        <Link
          to="/"
          className="text-sm text-zinc-400 text-center mt-4 hover:underline block mx-auto"
        >
          Continue Without Account
        </Link>
      </form>
    </div>
  );
}

export default Login;
