import { ADMIN_PASSWORD, AUTH_COOKIE_KEY } from "@app/config/constants";

import authorize from "@app/middlewares/authorize";
import jwtHelper from "@app/utils/jwtHelper";
import httpMocks from "node-mocks-http";

describe("middlewares/authorize", () => {
  const middleware = authorize();

  const callMiddleware = async (token?: string) => {
    const req = httpMocks.createRequest({
      cookies: {
        [AUTH_COOKIE_KEY]: token || ""
      }
    });

    const res = httpMocks.createResponse();

    const next = jest.fn();

    await middleware(req, res, next);

    return { res, next };
  };

  it("should call next", async () => {
    const token = await jwtHelper.signToken({
      password: ADMIN_PASSWORD
    });

    const { next } = await callMiddleware(token);

    expect(next).toHaveBeenCalled();
  });

  describe("should return a 401 error when", () => {
    it("auth cookie doesn't exist", async () => {
      const { res } = await callMiddleware();

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({
        message: "You need to be authenticated"
      });
    });

    it("jsonwebtoken is invalid", async () => {
      const { res } = await callMiddleware("invalid token");

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({
        message: "That trick is not going to work :)"
      });
    });
    
    it("the password is incorrect", async () => {
      const token = await jwtHelper.signToken({
        password: "incorrect password"
      });

      const { res } = await callMiddleware(token);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({
        message: "Password is incorrect"
      });
    });
  });
});
