import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../pages/Footer";
import Header from "../pages/Header";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 w-full px-4 py-6 sm:px-6 lg:px-8 mt-20">
        {/* mt-20 ensures content is not hidden under the fixed header */}
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 min-h-[calc(100vh-160px)]">
          {children ? children : <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
