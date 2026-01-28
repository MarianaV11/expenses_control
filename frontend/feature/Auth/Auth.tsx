"use client";

import { cn } from "@/lib/utils";
import { removeToken } from "@/service/local_storage";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Background from "./components/Background";
import LoginContainer from "./components_login/LoginContainer";
import LoginTagline from "./components_login/LoginTagline";
import RegisterContainer from "./components_register/RegisterContainer";
import RegisterTagline from "./components_register/RegisterTagline";

const Auth = () => {
  const [register, setRegister] = useState(false);

  const onClickRegister = () => {
    setRegister((prev) => !prev);
  };

  useEffect(() => {
    removeToken();
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] min-w-[100dvw] items-center justify-center overflow-hidden">
      <Background />
      <AnimatePresence mode="wait">
        {!register && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={cn(
              "absolute flex gap-[2rem] lg:gap-[10rem] justify-center items-center w-full",
            )}
          >
            <LoginTagline onRegisterClick={onClickRegister} />
            <LoginContainer onRegisterClick={onClickRegister} />
          </motion.div>
        )}
        {register && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={cn(
              "absolute flex gap-[2rem] lg:gap-[10rem] justify-center items-center w-full",
            )}
          >
            <RegisterContainer onRegisterClick={onClickRegister} />
            <RegisterTagline onRegisterClick={onClickRegister} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
