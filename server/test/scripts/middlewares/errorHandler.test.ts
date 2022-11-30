import errorHandler from "@app/middlewares/errorHandler";
import { mockExpress } from "../../helpers";

import { RequestError } from "@app/utils/errors";

describe("middlewares/errorHandler", () => {
  const loggerSpy = jest.spyOn(console, "error");

  beforeEach(() => {
    jest.resetAllMocks();

    // we need to overwrite the original logger implementation
    loggerSpy.mockImplementation();
  });

  const callMiddleware = (error: any) => {
    const mockedExpress = mockExpress();
    const { req, res, next } = mockedExpress;

    errorHandler(error, req as any, res as any, next);
    
    return mockedExpress;
  };

  describe("when the error is instance of RequestError", () => {
    const validationError = new RequestError(403, "error");

    it("should send a response to the user", () => {
      const { res } = callMiddleware(validationError);

      expect(res.status).toHaveBeenCalledWith(validationError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        message: validationError.message
      });
    });
  });

  it("should call the logger with the error if it's instance of Error", () => {
    const error = new Error("dummy");
    callMiddleware(error);

    expect(loggerSpy).toHaveBeenCalledWith(error);
  });

  it("should call the logger when the object is not an error", () => {
    // if it's the case that the error is not instance of the Error,
    // so we need to get as much information as possible,
    // to do that we going to pass the object or whatever into of String and then call the logger
    const object = { holi: "17" };

    callMiddleware(object);

    expect(loggerSpy).toHaveBeenCalledWith(String(object));
  });

  it("should send an 500 error to the user as a custom error message", () => {
    const error = new Error;
    const { res } = callMiddleware(error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "There was an internal server error trying to complete your request"
    });
  });
});
