import { TagFactory } from "../factories";
import { createRequest } from "../utils/request";

const request = createRequest();

describe("integration api/tags", () => {
  describe("GET /api/tags", () => {
    it("should return all tags", async () => {
      const tagA = await TagFactory.createOne();
      const tagB = await TagFactory.createOne();

      const res = await request.get("/api/tags").expect(200);

      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe(tagA.name);
      expect(res.body[1].name).toBe(tagB.name);
    });
  });
});
