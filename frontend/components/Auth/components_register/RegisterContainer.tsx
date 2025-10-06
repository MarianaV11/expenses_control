import RegisterForm from "./RegisterForm";

interface RegisterContainerProps {
  onRegisterClick: () => void;
}

const RegisterContainer = ({ onRegisterClick }: RegisterContainerProps) => {
  return (
    <div className="max-md:border max-md:p-10 max-md:rounded-2xl max-md:border-[#4300FF] max-md:m-3">
      <h1 className="font-bold text-center underline text-2xl mb-8">
        Register
      </h1>
      <p className="mb-8 text-sm max-md:block hidden">
        You already have an account? Click{" "}
        <span
          onClick={onRegisterClick}
          className="text-indigo-600 underline cursor-pointer hover:text-indigo-500"
        >
          here
        </span>{" "}
        to login.
      </p>
      <RegisterForm />
    </div>
  );
};

export default RegisterContainer;
