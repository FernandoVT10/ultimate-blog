import { faker } from "@faker-js/faker";
import { BlogPostFactory, TagFactory } from "../../factories";
import { createRequest } from "../../utils/request";

const request = createRequest();

describe("integration GET /api/blogposts/:id", () => {
  it("should response a blog post with its tags", async () => {
    const tag = await TagFactory.createOne();
    const blogPost = await BlogPostFactory.createOne({
      tags: [tag]
    });

    const res = await request
      .get(`/api/blogposts/${blogPost._id}`)
      .expect(200);

    expect(res.body.title).toBe(blogPost.title);
    expect(res.body.tags[0].name).toBe(tag.name);
  });

  it("should response with 400 when the id is invalid", async () => {
    await request.get("/api/blogposts/abc").expect(400);
  });

  it("should response with 404", async () => {
    await request.get(
      `/api/blogposts/${faker.database.mongodbObjectId()}`
    ).expect(404);
  });
});
