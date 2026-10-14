interface LoginTaglineProps {
  onRegisterClick: () => void;
}

const LoginTagline = ({ onRegisterClick }: LoginTaglineProps) => {
  return (
    <div className="max-w-md max-md:hidden">
      <h1 className="text-6xl font-extrabold mb-5 bg-gradient-to-r from-[#1e3a8a] to-[#60a5fa] dark:from-white dark:to-[#bfdbfe] bg-clip-text text-transparent">
        Welcome back
      </h1>
      <p className="text-2xl text-muted-foreground">
        Master your spending, achieve your dreams.
      </p>
      <p className="mt-16 text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Create one
        </button>
      </p>
    </div>
  );
};

export default LoginTagline;
