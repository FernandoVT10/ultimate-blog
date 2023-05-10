export class RequestError extends Error {
  constructor(
    readonly statusCode: number,
    message?: string
  ) {
    super(message);
  }
}
