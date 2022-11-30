import request from "../../../request";

import { BlogPostFactory, TagFactory } from "../../../factories";
import { convertToResponseBody, connectDB } from "../../../helpers";
import { faker } from "@faker-js/faker";

connectDB();

describe("GET /api/blogposts/[blogPostId]", () => {
  it("should response a blog post with tags", async () => {
    const tag = await TagFactory.createOne();
    const blogPost = await BlogPostFactory.createOne({
      tags: [tag]
    });

    const res = await request
      .get(`/api/blogposts/${blogPost._id}`)
      .expect(200);

    expect(res.body).toEqual(convertToResponseBody(blogPost));
  });

  it("should response with 400 when the id is invalid", async () => {
    const res = await request.get("/api/blogposts/abc").expect(400);

    expect(res).toContainValidationError({
      field: "blogPostId",
      message: "Id is invalid"
    });
  });

  it("should response with 404", async () => {
    await BlogPostFactory.createOne();

    const res = await request
      .get(`/api/blogposts/${faker.database.mongodbObjectId()}`)
      .expect(404);

    expect(res.body.message).toBe("BlogPost not found");
  });
});
