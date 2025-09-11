import React from "react";

const LoginTagline = () => {
  return (
    <div className="text-white">
      <h1 className="text-6xl font-extrabold mb-5 text-[#4300FF]">Welcome</h1>
      <p className="text-2xl">Master your spending, achieve your dreams.</p>
      <p className="mt-30">
        You don't have an account yet? Click{" "}
        <span className="text-indigo-600 underline cursor-pointer hover:text-indigo-500">
          here
        </span>{" "}
        to register.
      </p>
    </div>
  );
};

export default LoginTagline;
