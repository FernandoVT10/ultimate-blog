import { createRequest } from "../../utils/request";
import { BlogPostFactory, TagFactory } from "../../factories";

const request = createRequest();

describe("integration GET /api/blogposts", () => {
  it("should get all sorted from newest to oldest", async () => {
    const actualDate = Date.now();

    const blogPostA = await BlogPostFactory.createOne({
      createdAt: actualDate - 1000
    });

    const blogPostB = await BlogPostFactory.createOne({
      createdAt: actualDate
    });

    const blogPostC = await BlogPostFactory.createOne({
      createdAt: actualDate - 2000
    });

    const res = await request.get("/api/blogposts").expect(200);
    expect(res.body).toHaveLength(3);

    // C is the oldest followed by A and B is the newest
    expect(res.body[0].title).toBe(blogPostB.title);
    expect(res.body[1].title).toBe(blogPostA.title);
    expect(res.body[2].title).toBe(blogPostC.title);
  });

  it("should get all blogposts with their tags", async () => {
    const tagA = await TagFactory.createOne();
    const tagB = await TagFactory.createOne();

    await BlogPostFactory.createOne({
      tags: [tagA, tagB]
    });

    const res = await request.get("/api/blogposts").expect(200);

    const { tags } = res.body[0];
    expect(tags).toHaveLength(2);

    expect(tags[0].name).toBe(tagA.name);
    expect(tags[1].name).toBe(tagB.name);
  });

  describe("limit query option", () => {
    it("should get the number of posts specified", async () => {
      const blogPostA = await BlogPostFactory.createOne();
      await BlogPostFactory.createOne({
        // this is necessary to always get blogPostA first
        createdAt: Date.now() - 1000
      });

      const res = await request
        .get("/api/blogposts")
        .query({ limit: 1 })
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe(blogPostA.title);
    });

    it("should not fail when using a non number", async () => {
      await BlogPostFactory.createOne();
      await BlogPostFactory.createOne();

      const res = await request
        .get("/api/blogposts")
        .query({ limit: "non number" })
        .expect(200);

      expect(res.body).toHaveLength(2);
    });
  });
});
