"use client";

import { useState } from "react";
import LoginContainer from "./components_login/LoginContainer";
import LoginTagline from "./components_login/LoginTagline";
import Background from "./components/Background";
import RegisterTagline from "./components_register/RegisterTagline";
import RegisterContainer from "./components_register/RegisterContainer";

const Login = () => {
  const [register, setRegister] = useState<boolean>(false);

  const onClickRegister = () => {
    setRegister(!register);
    console.log(register);
  };

  return (
    <div className="flex min-h-[100dvh] min-w-[100dvw] items-center justify-center">
      <Background />
      <div className="relative gap-[10rem] flex justify-center">
        <LoginTagline onRegisterClick={onClickRegister} />
        <LoginContainer />
      </div>
      {/* <div className="relative gap-[10rem] flex justify-center">
        <RegisterContainer />
        <RegisterTagline onRegisterClick={onClickRegister} />
      </div> */}
    </div>
  );
};

export default Login;
