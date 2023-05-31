import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";
import { createAuthorizedAgent } from "../../utils/request";

import { BlogPostFactory, TagFactory } from "../../factories";

import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";

import BlogPost from "@app/models/BlogPost";

describe("PUT /api/blogposts/:blogPostId/updateTags", () => {
  let authenticatedRequest: SuperAgentTest;

  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/blogposts/abc/updateTags", "put");

  it("should update the tags", async () => {
    const tagA = await TagFactory.createOne();
    const tagB = await TagFactory.createOne();
    const tagC = await TagFactory.createOne();

    const blogPost = await BlogPostFactory.createOne({
      tags: [tagA._id]
    });

    await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateTags`)
      .send({
        tags: [tagB.name, tagC.name]
      })
      .expect(204);

    const updatedBlogPost = await BlogPost.findById(blogPost._id);

    // we're not populating the tags, so we use id's instead
    expect(updatedBlogPost?.tags).toHaveLength(2);
    expect(updatedBlogPost?.tags).not.toContainEqual(tagA._id);
  });

  it("should not fail if an object is passed", async () => {
    const blogPost = await BlogPostFactory.createOne({});

    await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateTags`)
      .send({
        tags: { obj: "invalid data" }
      })
      .expect(204);

    const updatedBlogPost = await BlogPost.findById(blogPost._id);

    expect(updatedBlogPost?.tags).toHaveLength(0);
  });

  it("should not fail if non existent tags are passed", async () => {
    const blogPost = await BlogPostFactory.createOne({});

    await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateTags`)
      .send({
        tags: ["tag #1"]
      })
      .expect(204);

    const updatedBlogPost = await BlogPost.findById(blogPost._id);

    expect(updatedBlogPost?.tags).toHaveLength(0);
  });

  it("should fail when blogPostId is invalid", async () => {
    const res = await authenticatedRequest
      .put("/api/blogposts/abc/updateTags")
      .send({ tags: [] })
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });

  it("should return a 404", async () => {
    const fakeId = faker.database.mongodbObjectId();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${fakeId}/updateTags`)
      .send({ tags: [] })
      .expect(404);

    expect(res.body.errors).toHaveLength(1);
  });
});
