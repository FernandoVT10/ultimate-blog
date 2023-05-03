import { createRequest } from "../utils/request";
import { ADMIN_PASSWORD } from "@app/constants";
import { AuthFactory } from "../factories";

import jwtHelper from "@app/utils/jwtHelper";

const request = createRequest();

describe("/api/admin", () => {
  describe("POST /api/admin/login", () => {
    it("should return a valid jwtoken", async () => {
      const res = await request.post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200);

      const authToken = res.body.token;

      await expect(
        jwtHelper.verifyToken(authToken)
      ).resolves.not.toThrow();
    });

    describe("should return an error if the password", () => {
      it("is empty", async () => {
        const res = await request.post("/api/admin/login").expect(400);

        expect(res.body.errors).toHaveLength(1);
      });

      it("is incorrect", async () => {
        const res = await request.post("/api/admin/login")
          .send({ password: "incorrect password" })
          .expect(400);

        expect(res.body.errors).toHaveLength(1);
      });
    });
  });

  describe("GET /api/admin/isLogged", () => {
    it("should return true", async () => {
      const authToken = await AuthFactory.generateToken();

      const res = await request
        .get("/api/admin/isLogged")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.isLogged).toBeTruthy();
    });

    describe("should return false when", () => {
      it("authorization header doesn't exist", async () => {
        const res = await request.get("/api/admin/isLogged").expect(200);
        expect(res.body.isLogged).toBeFalsy();
      });

      it("auth token is invalid", async () => {
        const res = await request
          .get("/api/admin/isLogged")
          .set("Authorization", "Bearer invalid token")
          .expect(200);

        expect(res.body.isLogged).toBeFalsy();
      });

      it("token is valid but the password doesn't match", async () => {
        const token = await jwtHelper.signToken({ password: "invalid password" });

        const res = await request
          .get("/api/admin/isLogged")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(res.body.isLogged).toBeFalsy();
      });
    });
  });
});
