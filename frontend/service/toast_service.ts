import { Bounce, toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "warning";

type ToastProps = {
  message: string;
  type?: ToastType;
};

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce,
};

export const showToast = ({ message, type = "success" }: ToastProps) => {
  toast[type](message, baseOptions);
};

export const showSuccessToast = (message: string) =>
  showToast({ message, type: "success" });

export const showErrorToast = (message: string) =>
  showToast({ message, type: "error" });

export const showWarningToast = (message: string) =>
  showToast({ message, type: "warning" });
