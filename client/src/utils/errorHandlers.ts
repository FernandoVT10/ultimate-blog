import { AxiosError } from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverErrorHandler = (error: any) => {
  if(error instanceof AxiosError && error.response?.status === 500) {
    const message = error.response?.data.errors[0].message;
    return toast.error(message);
  }

  toast.error("Something went wrong. Try it later.");
};
