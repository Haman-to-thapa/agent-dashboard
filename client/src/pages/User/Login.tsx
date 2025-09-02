import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import api from "../../api/axios";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", formData);

      if (res.data.user.role !== "user") {
        toast.error("Access denied: Not a user");
        return;
      }

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful ✅");
      window.location.href = "/user/dashboard";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://t3.ftcdn.net/jpg/09/10/13/54/360_F_910135428_IaSlPOWR9TUSvfY0G9eOZYCBKDIchw2X.jpg')`
      }}
    >
      <Toaster position="bottom-right" />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Welcome Back Employee</h2>
        <p className="text-gray-500 text-center mb-8">
          Sign in to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-left font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-left font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a href="/user/register" className="text-teal-600 hover:underline text-sm  font-semibold">You don't have any account sign-up</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition 
          ${loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
          >
            {loading ? "Signing in..." : "Sign in now"}
          </button>
        </form>
      </div>
    </div>
  )
}
