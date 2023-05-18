import axios, { AxiosError, RawAxiosRequestHeaders } from "axios";

import { API_URL } from "@config/constants";
import { getAuthToken } from "./authToken";

export type Method = "get" | "post" | "put" | "delete";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Variables = {[key: string]: any};

const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

const getAdditionalHeaders = (): RawAxiosRequestHeaders => {
  const additionalHeaders: RawAxiosRequestHeaders = {};

  if(isBrowser()) {
    additionalHeaders.Authorization = getAuthToken()
      ? `Bearer ${getAuthToken()}`
      : null;
  }

  return additionalHeaders;
};

const callApi = async <T>(method: Method, url: string, data?: Variables): Promise<T> => {
  const contentTypeHeader = data instanceof FormData
    ? "multipart/form-data"
    : "application/json";

  try {
    const res = await axios({
      url: `${API_URL}${url}`,
      method,
      params: method === "get" ? data : undefined,
      data: method !== "get" ? data : undefined,
      headers: {
        "Content-Type": contentTypeHeader,
        ...getAdditionalHeaders()
      },
    });

    return res.data;
  } catch (error) {
    if(error instanceof AxiosError && error.response) {
      throw error;
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
