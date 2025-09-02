// src/pages/AdminRegister.tsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", {
        ...formData,
        role: "admin",
      });

      toast.success("Admin registration successful ✅");
      if (res.data.token) localStorage.setItem("token", res.data.token);

      navigate('/admin/dashboard')

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6 tracking-wide">
          Admin <span className="text-teal-400">Register</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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

          <div>
            <label className="text-left block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-5">
          Already have an account?{" "}
          <a href="/admin/login" className="text-teal-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
