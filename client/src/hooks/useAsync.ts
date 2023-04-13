/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { useReducer } from "react";

type State<T> = {
  loading: boolean;
  value: T | null;
  error: Error | null;
}

type Action<T> = 
  | { type: "start" }
  | { type: "finish", value: T }
  | { type: "error", error: any };

type RunFn = (...args: any[]) => Promise<boolean>;

export type UseAsyncReturn<T> = State<T> & { run: RunFn };

export type ErrorHandler = (error: any) => void;

const useAsync = <T,>(
  fn: (...args: any[]) => Promise<T>,
  errorHandler: ErrorHandler = () => {}
): UseAsyncReturn<T> => {
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

  const run: RunFn = async (...args) => {
    try {
      dispatch({ type: "start" });
      const value = await fn(...args);
      dispatch({ type: "finish", value });
      return true;
    } catch (error) {
      dispatch({ type: "error", error });
      errorHandler(error);
      return false;
    }
  };

  return { ...state, run };
};

export default useAsync;
