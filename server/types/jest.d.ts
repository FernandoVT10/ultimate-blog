interface ValidationError {
  field: string;
  message: string;
}
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainValidationError(expected: ValidationError): R;
      toContainValidationErrors(expected: ValidationError[]): R;
    }
  }
}

export {};
