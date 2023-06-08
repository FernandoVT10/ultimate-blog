/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { useReducer, useRef } from "react";

type State<T> = {
  loading: boolean;
  value: T | null;
  error: Error | null;
}

type Action<T> = 
  | { type: "start" }
  | { type: "finish", value: T }
  | { type: "error", error: any }
  | { type: "setValue", value: T };

type RunFn<T> = (...args: any[]) => Promise<{
  success: boolean;
  data?: T;
  error?: any;
}>;

export type UseAsyncReturn<T> = State<T> & {
  run: RunFn<T>;
  setValue: (value: T) => void;
  hasBeenCalled: boolean;
};

export type ErrorHandler = (error: any) => void;

const useAsync = <T,>(
  fn: (...args: any[]) => Promise<T>,
  errorHandler: ErrorHandler = () => {}
): UseAsyncReturn<T> => {
  const hasBeenCalled = useRef(false);

  const stateReducer = (state: State<T>, action: Action<T>) => {
    switch (action.type) {
      case "start":
        return { loading: true, error: null, value: null };
      case "finish":
        return { loading: false, error: null, value: action.value };
      case "error":
        return { loading: false, error: action.error, value: null };
      case "setValue":
        return { ...state, value: action.value };
    }
  };

  const [state, dispatch] = useReducer(stateReducer, {
    loading: false,
    error: null,
    value: null
  });

  const run: RunFn<T> = async (...args) => {
    try {
      hasBeenCalled.current = true;
      dispatch({ type: "start" });
      const value = await fn(...args);
      dispatch({ type: "finish", value });

      return { success: true, data: value };
    } catch (error) {
      dispatch({ type: "error", error });
      errorHandler(error);

      return { success: false, error };
    }
  };

  const setValue = (newValue: T): void => {
    dispatch({
      type: "setValue",
      value: newValue
    });
  };

  return {
    ...state,
    run,
    setValue,
    hasBeenCalled: hasBeenCalled.current
  };
};

export default useAsync;
