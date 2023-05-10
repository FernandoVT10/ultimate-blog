import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";
import { BlogPostFactory } from "../../factories";
import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";
import { createAuthorizedAgent } from "../../utils/request";

describe("PUT /api/blogposts/:blogPostId/updateTitle", () => {
  let authenticatedRequest: SuperAgentTest;
  
  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/blogposts/abc/updateTitle", "put");

  it("should update the title", async () => {
    const blogPost = await BlogPostFactory.createOne();
    const newTitle = "updated title";

    await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateTitle`)
      .send({ title: newTitle })
      .expect(204);
  });

  it("should fail when title is invalid", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateTitle`)
      .send({ title: { test: "title" } })
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });

  it("should fail when blogPostId is invalid", async () => {
    const res = await authenticatedRequest
      .put("/api/blogposts/abc/updateTitle")
      .send({ title: "abc" })
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });

  it("should return a 404", async () => {
    const fakeId = faker.database.mongodbObjectId();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${fakeId}/updateTitle`)
      .send({ title: "text" })
      .expect(404);

    expect(res.body.errors).toHaveLength(1);
  });
});
