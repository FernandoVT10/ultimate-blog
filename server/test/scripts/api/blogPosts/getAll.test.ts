import request from "../../../request";

import { BlogPostFactory, TagFactory } from "../../../factories";
import { convertToResponseBody, connectDB } from "../../../helpers";

connectDB();


describe("GET /api/blogposts", () => {
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
    expect(res.body).toEqual(
      convertToResponseBody([
        blogPostB, blogPostA, blogPostC
      ])
    );
  });

  it("should get blogPosts with its tags populated", async () => {
    const tagA = await TagFactory.createOne();
    const tagB = await TagFactory.createOne();
    
    await BlogPostFactory.createOne({
      tags: [tagA, tagB]
    });

    const res = await request.get("/api/blogposts").expect(200);

    expect(res.body[0].tags).toEqual(
      convertToResponseBody([tagA, tagB])
    );
  });

  describe("tags query option", () => {
    it("should get only the posts with a specific tag", async () => {
      const tagA = await TagFactory.createOne();
      const tagB = await TagFactory.createOne();

      const blogPostA = await BlogPostFactory.createOne({
        tags: [tagA]
      });

      const blogPostB = await BlogPostFactory.createOne({
        tags: [tagA, tagB]
      });

      const blogPostC = await BlogPostFactory.createOne();

      const res = await request.get("/api/blogposts").query({
        tags: tagA.name
      }).expect(200);

      expect(res.body).toHaveLength(2);

      expect(res.body).toEqual(
        expect.arrayContaining(
          convertToResponseBody([ blogPostA, blogPostB ])
        )
      );

      expect(res.body).not.toContain(convertToResponseBody(blogPostC));
    });

    it("should only get posts that match with many tags", async () => {
      const tagA = await TagFactory.createOne();
      const tagB = await TagFactory.createOne();

      const blogPostA = await BlogPostFactory.createOne({
        tags: [tagA, tagB]
      });

      await BlogPostFactory.createOne({
        tags: [tagA]
      });

      const res = await request.get("/api/blogposts").query({
        tags: [tagA.name, tagB.name]
      }).expect(200);

      expect(res.body).toHaveLength(1);

      expect(res.body[0]).toEqual(convertToResponseBody(blogPostA));
    });

    describe("should get an empty array when", () => {
      beforeEach(async () => {
        await BlogPostFactory.createOne();
        await BlogPostFactory.createOne();
      });

      it("we send an array of objects", async () => {
        const res = await request.get("/api/blogposts?tags[1][foo]=bar&tags[1][bar]=baz")
          .expect(200);

        expect(res.body).toHaveLength(0);
      });

      it("we send an object", async () => {
        const res = await request.get("/api/blogposts")
          .query({ tags: {obj: "foo"} })
          .expect(200);

        expect(res.body).toHaveLength(0);
      });

      it("we send tag names that doesn't exist", async () => {
        const res = await request.get("/api/blogposts")
          .query({ tags: ["abc", "foo"] })
          .expect(200);

        expect(res.body).toHaveLength(0);
      });
    });
  });
});
