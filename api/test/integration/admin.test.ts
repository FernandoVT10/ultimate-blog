import { createRequest } from "../utils/request";
import { ADMIN_PASSWORD } from "@app/constants";

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
});
