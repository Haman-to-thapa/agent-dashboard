import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/login";


export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Call login API
      const res = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Check role
      if (res.data.user.role !== "admin") {
        toast.error("Access denied: Not an admin");
        return;
      }

      toast.success("Login successful ✅");

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect to admin dashboard
      window.location.href = "/admin/dashboard";

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Admin <span className="text-teal-400">Login</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-left">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-lime-400 text-black font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-5">
          Don’t have an account?{" "}
          <a href="/admin/register" className="text-teal-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
