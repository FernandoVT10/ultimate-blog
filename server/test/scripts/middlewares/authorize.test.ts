import { ADMIN_PASSWORD, AUTH_COOKIE_KEY } from "@app/config/constants";
import { mockExpress } from "../../helpers";

import authorize from "@app/middlewares/authorize";
import jwtHelper from "@app/utils/jwtHelper";

describe("middlewares/authorize", () => {
  const middleware = authorize();

  const callMiddleware = async (token?: string) => {
    const { req, res, next } = mockExpress();

    req.cookies = {};

    if(token) {
      req.cookies[AUTH_COOKIE_KEY] = token;
    }

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

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "You need to be authenticated"
      });
    });

    it("jsonwebtoken is invalid", async () => {
      const { res } = await callMiddleware("invalid token");

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "That trick is not going to work :)"
      });
    });
    
    it("the password is incorrect", async () => {
      const token = await jwtHelper.signToken({
        password: "incorrect password"
      });

      const { res } = await callMiddleware(token);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password is incorrect"
      });
    });
  });
});
