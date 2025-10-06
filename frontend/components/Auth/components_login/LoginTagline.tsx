import React from "react";

interface LoginTaglineProps {
  onRegisterClick: () => void;
}

const LoginTagline = ({ onRegisterClick }: LoginTaglineProps) => {
  return (
    <div className="text-center max-md:hidden">
      <h1 className="text-6xl font-extrabold mb-5 text-[#4300FF]">Welcome</h1>
      <p className="text-2xl">Master your spending, achieve your dreams.</p>
      <p className="mt-30">
        You don't have an account yet? Click{" "}
        <span
          onClick={onRegisterClick}
          className="text-indigo-600 underline cursor-pointer hover:text-indigo-500"
        >
          here
        </span>{" "}
        to register.
      </p>
    </div>
  );
};

export default LoginTagline;
