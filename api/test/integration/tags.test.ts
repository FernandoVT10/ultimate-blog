import { SuperAgentTest } from "supertest";
import { AuthFactory, TagFactory } from "../factories";
import { createRequest, createAgent } from "../utils/request";

import checkAuthorizeMiddleware from "../utils/checkAuthorizationMiddleware";

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

  describe("POST /api/tags", () => {
    checkAuthorizeMiddleware("/api/tags", "post");

    let authenticatedRequest: SuperAgentTest;

    beforeEach(async () => {
      authenticatedRequest = createAgent();

      const authToken = await AuthFactory.generateToken();
      authenticatedRequest.set("Authorization", `Bearer ${authToken}`);
    });

    it("should create a tag", async () => {
      const name = "music";
      const res = await authenticatedRequest
        .post("/api/tags")
        .send({ name })
        .expect(200);

      expect(res.body.name).toBe(name);
    });

    it("should fail when name already exists", async () => {
      const tag = await TagFactory.createOne();

      const res = await authenticatedRequest
        .post("/api/tags")
        .send({ name: tag.name })
        .expect(400);

      const errorMessage = res.body.errors[0].message;
      expect(errorMessage).toBe(`A tag called "${tag.name}" already exists`);
    });
  });
});
