import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { API_URL } from "./constants";

const instance = axios.create({
  baseURL: API_URL
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if(error.response) {
      return Promise.reject(error);
    }

    console.error("Error trying to reach the api", error);

    if(typeof window !== "undefined") {
      if(!navigator.onLine) {
        toast.error("You don't have connection to internet.");
      }

      toast.error("There was an error trying to complete your request.");
    }
  }
);

export default instance;
