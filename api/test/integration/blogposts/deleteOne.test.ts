import fs from "fs";

import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";
import { createAuthorizedAgent } from "../../utils/request";
import { BlogPostFactory } from "../../factories";

import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";
import BlogPostCover from "@app/utils/BlogPostCover";
import generators from "../../utils/generators";

describe("DELETE /api/blogposts/:blogPostId", () => {
  let authenticatedRequest: SuperAgentTest;

  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/blogposts/abc", "delete");

  it("should delete a post", async () => {
    // if the dir is not created we're going to get a ENOENT error
    await fs.promises.mkdir(BlogPostCover.BASE_PATH, { recursive: true });

    const cover = new BlogPostCover();

    const coverBuffer = await generators.generateImageBuffer();
    await cover.saveBuffer(coverBuffer);

    const blogPost = await BlogPostFactory.createOne({
      cover: cover.getName()
    });

    const res = await authenticatedRequest
      .delete(`/api/blogposts/${blogPost._id}`)
      .expect(200);

    expect(res.body.title).toBe(blogPost.title);

    expect(await cover.coverExists()).toBeFalsy();
  });

  it("should fail when blogPostId is invalid", async () => {
    const res = await authenticatedRequest
      .delete("/api/blogposts/abc")
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });

  it("should return a 404", async () => {
    const fakeId = faker.database.mongodbObjectId();

    const res = await authenticatedRequest
      .delete(`/api/blogposts/${fakeId}`)
      .expect(404);

    expect(res.body.errors).toHaveLength(1);
  });
});
