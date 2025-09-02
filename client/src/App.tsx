import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AdminLogin from "./pages/Admin/Login"
import AdminRegister from "./pages/Admin/Register"
import UserLogin from "./pages/User/Login"
import UserRegister from "./pages/User/Register"
import AdminDashboard from "./Component/AdminDashboard"
import UserDashboard from "./Component/UserDashboard "
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import UserSearch from "./Component/Search"






const isLoggedIn = () => !!localStorage.getItem("token");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* User auth */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />

        {/* Protected Dashboards */}
        <Route
          path="/user/dashboard"
          element={
            isLoggedIn() ? (
              <Layout>
                <UserDashboard />
              </Layout>
            ) : (
              <Navigate to="/user/login" />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn() ? (
              <Layout>
                <AdminDashboard />
              </Layout>
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/search"
          element={
            <Layout>
              <UserSearch />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;