import httpMocks from "node-mocks-http";
import checkValidation from "@app/middlewares/checkValidation";

import { body } from "express-validator";

describe("middlewares/checkValidation", () => {
  const middleware = checkValidation();

  it("should call next when no errors", () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    middleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });

  it("should return the errors formatted", async () => {
    const req = httpMocks.createRequest({
      body: {
        test: ""
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    const validationMiddleware = body("test")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage("Test is required");

    // all express validator middlewares are asynchronous
    await validationMiddleware(req, res, next);

    middleware(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      errors: [
        {
          field: "test",
          message: "Test is required"
        }
      ]
    });
  });
});
