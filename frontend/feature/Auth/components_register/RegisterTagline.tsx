interface RegisterTaglineProps {
  onRegisterClick: () => void;
}

const RegisterTagline = ({ onRegisterClick }: RegisterTaglineProps) => {
  return (
    <div className="max-w-md max-md:hidden">
      <h1 className="text-6xl font-extrabold mb-7 pb-2 bg-gradient-to-r from-[#1e3a8a] to-[#60a5fa] dark:from-white dark:to-[#bfdbfe] bg-clip-text text-transparent">
        Register Now!
      </h1>
      <p className="text-2xl text-muted-foreground">
        Start your journey to financial freedom today.
      </p>
      <p className="mt-16 text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterTagline;
