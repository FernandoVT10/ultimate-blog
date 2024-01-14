import { useEffect } from "react";

import axios, { Variables, Method } from "@utils/axios";
import useAsync, { ErrorHandler, UseAsyncReturn } from "./useAsync";

type Options = {
  lazy?: boolean;
};

// TODO: change the name for "useInstantQuery"
export const useQuery = <T,>(
  url: string,
  parameters?: Variables,
  options: Options = {}
): UseAsyncReturn<T> => {
  const { lazy = false } = options;

  const {
    run,
    hasBeenCalled,
    loading,
    ...state
  } = useAsync<T>(async () => {
    return await axios.get<T>(url, parameters);
  });

  useEffect(() => {
    if(!lazy) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    run,
    hasBeenCalled,
    // when app is loaded, the loading variable in the hook is false
    // but if the query is not lazy it means it must be true since the start
    loading: !lazy && !hasBeenCalled || loading
  };
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
