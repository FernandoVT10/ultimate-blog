import axios, { AxiosError } from "axios";

import { API_CONTAINER_URL } from "@config/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Variables = {[key: string]: any};

const get = async <T>(url: string, params?: Variables): Promise<T> => {
  try {
    const res = await axios({
      url: `${API_CONTAINER_URL}${url}`,
      method: "get",
      params: params,
    });

    return res.data;
  } catch (error) {
    if(error instanceof AxiosError && error.response) {
      throw error;
    }

    throw new Error("Something went wrong. Check your internet connection or try it later.");
  }
};

const serverApi = {
  get
};

export default serverApi;
