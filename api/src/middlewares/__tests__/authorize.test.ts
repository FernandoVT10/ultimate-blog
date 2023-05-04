import { ADMIN_PASSWORD } from "../../constants";

import authorize from "../authorize";
import jwtHelper from "../../utils/jwtHelper";
import httpMocks from "node-mocks-http";

describe("middlewares/authorize", () => {
  const middleware = authorize();

  const callMiddleware = async (token: string) => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    const res = httpMocks.createResponse();

    const next = jest.fn();

    await middleware(req, res, next);

    return { res, next };
  };

  it("should call next when user is authenticated", async () => {
    const token = await jwtHelper.signToken({
      password: ADMIN_PASSWORD
    });

    const { next } = await callMiddleware(token);

    expect(next).toHaveBeenCalled();
  });

  describe("should return a 401 error when", () => {
    it("there is no authorization header", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      middleware(req, res, jest.fn());

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({
        errors: [{
          message: "You need to be authenticated"
        }]
      });
    });

    it("jsonwebtoken is invalid", async () => {
      const { res } = await callMiddleware("invalid token");

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({
        errors: [{
          message: "Invalid password"
        }]
      });
    });
    
    it("the password is incorrect", async () => {
      const token = await jwtHelper.signToken({
        password: "incorrect password"
      });

      const { res } = await callMiddleware(token);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({
        errors: [{
          message: "Invalid password"
        }]
      });
    });
  });
});
