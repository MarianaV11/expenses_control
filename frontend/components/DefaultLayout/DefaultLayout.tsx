import React from "react";
import { Navbar } from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

interface DefaultLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DefaultLayout = ({ children, className }: DefaultLayoutProps) => {
  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {/* Top navigation bar */}
      <Navbar />

      {/* Sidebar on the left */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Page content area (scrollable if content overflows) */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#161a1e]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
