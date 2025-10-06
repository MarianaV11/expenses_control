import React from "react";

interface RegisterTaglineProps {
  onRegisterClick: () => void;
}

const RegisterTagline = ({ onRegisterClick }: RegisterTaglineProps) => {
  return (
    <div className="text-center max-md:hidden">
      <h1 className="text-6xl font-extrabold mb-5 text-[#4300FF]">
        Register Now!
      </h1>
      <p className="text-2xl">Start your journey to financial freedom today.</p>
      <p className="mt-30">
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
