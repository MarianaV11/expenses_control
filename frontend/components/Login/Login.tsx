import React from "react";
import LoginContainer from "./components/LoginContainer";
import LoginBackground from "./components/LoginBackground";

const Login = () => {
  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center">
      <LoginBackground />
      <LoginContainer />
    </div>
  );
};

export default Login;
