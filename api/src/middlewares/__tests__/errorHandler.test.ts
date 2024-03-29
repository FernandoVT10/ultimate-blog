import errorHandler from "../errorHandler";
import httpMocks from "node-mocks-http";

import { RequestError } from "../../utils/errors";

describe("middlewares/errorHandler", () => {
  const loggerSpy = jest.spyOn(console, "error");

  beforeEach(() => {
    jest.resetAllMocks();

    loggerSpy.mockImplementation();
  });

  const callMiddleware = (error: any) => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const next = jest.fn();

    errorHandler(error, req, res, next);
    
    return res;
  };

  describe("when the error is instance of RequestError", () => {
    it("should send a response to the user", () => {
      const validationError = new RequestError(403, "error");

      const res = callMiddleware(validationError);

      expect(res.statusCode).toBe(validationError.statusCode);
      expect(res._getJSONData()).toEqual({
        errors: [{
          message: validationError.message
        }]
      });
    });

    it("should return no body when no message is setted", () => {
      const validationError = new RequestError(403);

      const res = callMiddleware(validationError);

      expect(res.statusCode).toBe(validationError.statusCode);
      expect(res._isJSON()).toBeFalsy();
    });
  });

  it("should call the logger with the error if it's instance of Error", () => {
    const error = new Error("dummy");
    callMiddleware(error);

    expect(loggerSpy).toHaveBeenCalledWith(error);
  });

  it("should call the logger when the object is not an error", () => {
    const object = { holi: "17" };

    callMiddleware(object);

    expect(loggerSpy).toHaveBeenCalledWith(String(object));
  });

  it("should send an 500 error to the user as a custom error message", () => {
    const error = new Error;
    const res = callMiddleware(error);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      errors: [{
        message: "There was an internal server error trying to complete your request"
      }]
    });
  });
});
