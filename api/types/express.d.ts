import { RequestError } from "../src/utils/errors";

declare global {
  namespace Express {
    interface Request {
      requestError: RequestError;
    }
  }
}

export {};
