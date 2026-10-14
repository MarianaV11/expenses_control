import LoginForm from "./LoginForm";

interface LoginContainerProps {
  onRegisterClick: () => void;
}

const LoginContainer = ({ onRegisterClick }: LoginContainerProps) => {
  return (
    <div className="w-full max-w-sm mx-3 border rounded-2xl bg-card/80 backdrop-blur-md shadow-xl p-8 max-md:p-6">
      <h1 className="font-bold text-2xl">Sign in</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-8">
        Enter your credentials to access your account.
      </p>
      <LoginForm />
      <p className="mt-6 text-sm text-center text-muted-foreground md:hidden">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginContainer;
