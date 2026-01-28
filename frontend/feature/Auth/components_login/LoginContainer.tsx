import LoginForm from "./LoginForm";

interface LoginContainerProps {
  onRegisterClick: () => void;
}

const LoginContainer = ({ onRegisterClick }: LoginContainerProps) => {
  return (
    <div className="max-md:border max-md:p-10 max-md:rounded-2xl max-md:border-[#4300FF] max-md:m-3">
      <h1 className="font-bold text-center underline text-2xl mb-8">Sign in</h1>
      <p className="mb-8 text-sm max-md:block hidden">
        You don't have an account yet? Click{" "}
        <span
          onClick={onRegisterClick}
          className="text-indigo-600 underline cursor-pointer hover:text-indigo-500"
        >
          here
        </span>{" "}
        to register.
      </p>
      <LoginForm />
    </div>
  );
};

export default LoginContainer;
