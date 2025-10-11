import React from "react";
import { Navbar } from "./components/Navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DefaultLayout = ({ children, className }: DefaultLayoutProps) => {
  return (
    <div className={`${className}`}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default DefaultLayout;
