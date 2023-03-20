import axios, { AxiosError } from "axios";

import { API_URL } from "@config/constants";

type Method = "get" | "post" | "put" | "delete";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Variables = {[key: string]: any};

const callApi = async <T>(method: Method, url: string, data?: Variables): Promise<T> => {
  try {
    const res = await axios({
      url: `${API_URL}${url}`,
      method,
      params: method === "get" ? data : undefined,
      data: method !== "get" ? data : undefined,
      headers: {
        "Content-Type": "application/json",
        withCredentials: true
      }
    });

    return res.data;
  } catch (error) {
    if(error instanceof AxiosError && error.response) {
      if(error.response.data.error) {
        throw new Error(error.response.data.error);
      } else if(error.response.data.errors) {
        throw error.response.data.errors;
      }
    }

    throw new Error("Something went wrong. Check your internet connection or try it later.");
  }
};

type Args = [string, Variables?];

const api = {
  get: <T>(...args: Args) => callApi<T>("get", ...args),
  post: <T>(...args: Args) => callApi<T>("post", ...args),
  put: <T>(...args: Args) => callApi<T>("put", ...args),
  delete: <T>(...args: Args) => callApi<T>("delete", ...args)
};

export default api;
