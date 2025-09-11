import LoginBackground from "./components/LoginBackground";
import LoginContainer from "./components/LoginContainer";
import LoginTagline from "./components/LoginTagline";

const Login = () => {
  return (
    <div className="flex min-h-[100dvh] min-w-[100dvw] items-center justify-center">
      <LoginBackground />
      <div className="relative gap-[10rem] flex justify-center">
        <LoginTagline />
        <LoginContainer />
      </div>
    </div>
  );
};

export default Login;
