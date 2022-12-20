import { Response } from "supertest";
import { AuthFactory } from "../../factories";
import { ADMIN_PASSWORD, AUTH_COOKIE_KEY } from "@app/config/constants";

import request from "../../request";
import jwtHelper from "@app/utils/jwtHelper";

const getAuthTokenFromCookies = (res: Response): string => {
  const cookieString = res.headers["set-cookie"][0];
  const authTokenString = cookieString.split(";")[0];
  return authTokenString.replace(`${AUTH_COOKIE_KEY}=`, "");
};

describe("integration api/admin", () => {
  describe("GET /api/admin/status", () => {
    it("should return isLogged to true", async () => {
      const authToken = await AuthFactory.generateAuthToken();

      const res = await request
        .get("/api/admin/status")
        .set("Cookie", authToken)
        .expect(200);

      expect(res.body.isLogged).toBeTruthy();
    });

    describe("should return isLogged to false when", () => {
      it("the auth cookie doesn't exist", async () => {
        const res = await request.get("/api/admin/status").expect(200);
        expect(res.body.isLogged).toBeFalsy();
      });

      it("auth token is invalid", async () => {
        const res = await request
          .get("/api/admin/status")
          .set("Cookie", `${AUTH_COOKIE_KEY}=invalid-token`)
          .expect(200);

        expect(res.body.isLogged).toBeFalsy();
      });

      it("token is valid but the password in it doesn't match", async () => {
        const token = await jwtHelper.signToken({ password: "invalid password" });

        const res = await request
          .get("/api/admin/status")
          .set("Cookie", `${AUTH_COOKIE_KEY}=${token}`)
          .expect(200);

        expect(res.body.isLogged).toBeFalsy();
      });
    });
  });

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

      expect(res.body.message).toBe("You've been logged in!");
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
});
