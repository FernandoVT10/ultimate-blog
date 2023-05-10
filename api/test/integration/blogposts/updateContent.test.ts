import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";
import { BlogPostFactory } from "../../factories";
import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";
import { createAuthorizedAgent } from "../../utils/request";

describe("PUT /api/blogposts/:blogPostId/updateContent", () => {
  let authenticatedRequest: SuperAgentTest;
  
  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/blogposts/abc/updateContent", "put");

  it("should update the content", async () => {
    const blogPost = await BlogPostFactory.createOne();

    await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateContent`)
      .send({ content: "updated content" })
      .expect(204);
  });

  it("should fail when content is invalid", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateContent`)
      .send({ content: { test: "content" } })
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });
  //
  it("should fail when blogPostId is invalid", async () => {
    const res = await authenticatedRequest
      .put("/api/blogposts/abc/updateContent")
      .send({ content: "abc" })
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });
  //
  it("should return a 404", async () => {
    const fakeId = faker.database.mongodbObjectId();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${fakeId}/updateContent`)
      .send({ content: "abc" })
      .expect(404);

    expect(res.body.errors).toHaveLength(1);
  });
});
