import Image from "next/image";
import React from "react";

interface RegisterTaglineProps {
  onRegisterClick: () => void;
}

const RegisterTagline = ({ onRegisterClick }: RegisterTaglineProps) => {
  return (
    <div className="text-white">
      <h1 className="text-6xl font-extrabold mb-5 text-[#4300FF]">
        Register Now!
      </h1>
      <p className="w-[25rem] text-lg">
        Start your journey to financial freedom today. With our platform, you
        can easily track your expenses, organize your budget, and take smarter
        decisions to achieve the dreams you’ve always wanted.
      </p>
      <p className="mt-40">
        You already have an account? Click{" "}
        <span
          onClick={onRegisterClick}
          className="text-indigo-600 underline cursor-pointer hover:text-indigo-500"
        >
          here
        </span>{" "}
        to login.
      </p>
    </div>
  );
};

export default RegisterTagline;
