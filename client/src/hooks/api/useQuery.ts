import { useReducer, useEffect } from "react";

import axios, { Variables } from "@utils/axios";

type State<T> = {
  loading: boolean;
  value: T | null;
  error: Error | null;
}

type Action<T> = 
  | { type: "start" }
  | { type: "finish", value: T }
  | { type: "error", error: Error }

const useQuery = <T,>(url: string, parameters?: Variables): State<T> => {
  const stateReducer = (_: State<T>, action: Action<T>) => {
    switch (action.type) {
      case "start":
        return { loading: true, error: null, value: null };
      case "finish":
        return { loading: false, error: null, value: action.value };
      case "error":
        return { loading: false, error: action.error, value: null };
    }
  };

  const [state, dispatch] = useReducer(stateReducer, {
    loading: false,
    error: null,
    value: null 
  });

  useEffect(() => {
    const runQuery = async () => {
      try {
        dispatch({ type: "start" });
        const value = await axios.get<T>(url, parameters);
        dispatch({ type: "finish", value });
      } catch (error) {
        dispatch({ type: "error", error: error as Error });
      }
    };

    runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state };
};

export default useQuery;
