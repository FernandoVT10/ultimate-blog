import { useEffect } from "react";

import axios, { Variables, Method } from "@utils/axios";
import useAsync, { ErrorHandler, UseAsyncReturn } from "./useAsync";

export const useQuery = <T,>(
  url: string,
  parameters?: Variables
): Omit<UseAsyncReturn<T>, "run"> => {
  const { run, ...state } = useAsync<T>(async () => {
    return await axios.get<T>(url, parameters);
  });

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};

export const useMutation = <T,>(
  method: Method,
  url: string,
  errorHandler?: ErrorHandler
): UseAsyncReturn<T> => {
  const state = useAsync<T>(async (data: Variables) => {
    return await axios[method]<T>(url, data);
  }, errorHandler);

  return state;
};
