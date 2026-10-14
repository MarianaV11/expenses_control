import RegisterForm from "./RegisterForm";

interface RegisterContainerProps {
  onRegisterClick: () => void;
}

const RegisterContainer = ({ onRegisterClick }: RegisterContainerProps) => {
  return (
    <div className="w-full max-w-sm mx-3 border rounded-2xl bg-card/80 backdrop-blur-md shadow-xl p-8 max-md:p-6">
      <h1 className="font-bold text-2xl">Create account</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-8">
        Fill in your details to get started.
      </p>
      <RegisterForm />
      <p className="mt-6 text-sm text-center text-muted-foreground md:hidden">
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

export default RegisterContainer;
