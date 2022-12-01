import jwt from "jsonwebtoken";
import jwtHelper from "@app/utils/jwtHelper";
import { JWT_SECRET_KEY } from "@app/config/constants";

describe("utils/jwtHelper", () => {
  const data = { user: "jhon" };

  describe("verifyToken", () => {
    it("should return the data asynchronously", () => {

      const token = jwt.sign(data, JWT_SECRET_KEY);

      return expect(jwtHelper.verifyToken(token))
        .resolves.toMatchObject(data);
    });

    it("should reject", () => {
      return expect(jwtHelper.verifyToken("invalid token"))
        .rejects.toThrow();
    });
  });

  describe("signToken", () => {
    it("should return the signed token asynchronously", async () => {
      const token = await jwtHelper.signToken(data);

      expect(jwt.verify(token, JWT_SECRET_KEY)).toBeDefined();
    });
  });
});
