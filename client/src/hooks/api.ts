import { useEffect, useState } from "react";

import axios, { Variables, Method } from "@utils/axios";
import useAsync, { ErrorHandler, UseAsyncReturn } from "./useAsync";

export const useQuery = <T,>(
  url: string,
  parameters?: Variables
): Omit<UseAsyncReturn<T>, "run"> => {
  const [localLoading, setLocalLoading] = useState(true);

  const { run, ...state } = useAsync<T>(async () => {
    return await axios.get<T>(url, parameters);
  });

  useEffect(() => {
    const runQuery = async () => {
      await run();
      setLocalLoading(false);
    };

    runQuery();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // here we're using a local loading instead of the one returned by the
  // useAsync hook, because when the app loads the hook returns
  // false and this hook must return true since the beginning 
  return { ...state, loading: localLoading };
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
