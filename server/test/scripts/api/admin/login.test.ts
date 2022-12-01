import { Response } from "supertest";
import { ADMIN_PASSWORD, AUTH_COOKIE_KEY } from "@app/config/constants";

import request from "../../../request";
import jwtHelper from "@app/utils/jwtHelper";

const getAuthTokenFromCookies = (res: Response): string => {
  const cookieString = res.headers["set-cookie"][0];
  const authTokenString = cookieString.split(";")[0];
  return authTokenString.replace(`${AUTH_COOKIE_KEY}=`, "");
};

describe("POST /api/admin/login", () => {
  it("should set a cookie with the jwt token", async () => {
    const res = await request.post("/api/admin/login")
      .send({ password: ADMIN_PASSWORD })
      .expect(200);

    expect(res.headers["set-cookie"]).toBeDefined();

    const authToken = getAuthTokenFromCookies(res);

    await expect(
      jwtHelper.verifyToken(authToken)
    ).resolves.not.toThrow();

    expect(res.body.message).toBe("You've been logged in!")
  });

  describe("should return an error if the password", () => {
    it("Is incorrect", async () => {
      const res = await request.post("/api/admin/login")
        .send({ password: "incorrect password" })
        .expect(400);

      expect(res).toContainValidationError({
        field: "password",
        message: "Password is incorrect"
      });
    });

    it("Is not sent", async () => {
      const res = await request.post("/api/admin/login").expect(400);

      expect(res).toContainValidationError({
        field: "password",
        message: "Password is required"
      });
    });
  });
});
