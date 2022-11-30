declare global {
  namespace jest {
    interface Matchers<R> {
      toContainValidationError(expected: { field: string, message: string }): R;
    }
  }
}

export {};
