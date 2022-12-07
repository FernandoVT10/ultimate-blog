import path from "path";
import fs from "fs";
import request from "../../request";

import BlogPostCover from "@app/lib/BlogPostCover";

import { BlogPostFactory, TagFactory, AuthFactory } from "../../factories";

import {
  checkAuthorizeMiddleware,
  convertToResponseBody,
  connectDB,
  checkIfFileExists
} from "../../helpers";

import { faker } from "@faker-js/faker";

connectDB();

const IMAGE_FIXTURE_PATH = path.resolve(__dirname, "../../fixtures/image.png");

describe("integration api/blogposts", () => {
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

  describe("GET /api/blogposts/:blogPostId", () => {
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

  describe("POST /api/blogposts", () => {
    checkAuthorizeMiddleware("/api/blogposts", "post");

    it("should create a blogPost", async () => {
      // if the dir is not created we're going to get a ENOENT error
      await fs.promises.mkdir(BlogPostCover.BASE_PATH, { recursive: true });

      const authToken = await AuthFactory.generateAuthToken();

      const tagA = await TagFactory.createOne();
      const tagB = await TagFactory.createOne();

      const title = faker.lorem.words(3);
      const content = faker.lorem.sentence();

      const res = await request.post("/api/blogposts")
        .set("Cookie", authToken)
        .field("title", title)
        .field("content", content)
        .field("tags", [tagA.name, tagB.name])
        .attach("cover", IMAGE_FIXTURE_PATH)
        .expect(200);

      // get the name of the cover
      const cover = path.basename(res.body.cover);

      const coverPath = path.resolve(BlogPostCover.BASE_PATH, cover);
      expect(await checkIfFileExists(coverPath)).toBeTruthy();

      expect(res.body).toMatchObject({
        title,
        content,
        tags: convertToResponseBody([tagA, tagB])
      });
    });

    describe("validation should fail when", () => {
      const callApi = async (data: any) => {
        const authToken = await AuthFactory.generateAuthToken();

        const res = await request.post("/api/blogposts")
          .set("Cookie", authToken)
          .send(data);

        return res;
      };

      it("cover is not an image", async () => {
        const authToken = await AuthFactory.generateAuthToken();

        const res = await request.post("/api/blogposts")
          .set("Cookie", authToken)
          .attach("cover", Buffer.from([12]), {
            filename: "test.txt",
            contentType: "text"
          });

        expect(res.body.message).toBe("Files must be .png, .jpeg, .jpg or .webp");
      });

      it("fields have invalid values", async () => {
        const notAString = {
          obj: "foo"
        };

        const res = await callApi({
          title: notAString,
          content: notAString
        });

        expect(res).toContainValidationErrors([
          { field: "title", message: "Title must be a string" },
          { field: "content", message: "Content must be a string" }
        ]);
      });

      it("fields are empty", async () => {
        const res = await callApi({});

        expect(res).toContainValidationErrors([
          { field: "title", message: "Title is required" },
          { field: "content", message: "Content is required" },
          { field: "cover", message: "Cover is required" }
        ]);
      });

      it("fields are larger than expected", async () => {
        const res = await callApi({
          title: faker.random.alpha(101),
          content: faker.random.alpha(5001)
        });

        expect(res).toContainValidationErrors([
          {
            field: "title",
            message: "Title can't be larger than 100 characters"
          },
          {
            field: "content",
            message: "Content can't be larger than 5000 characters"
          }
        ]);
      });
    });
  });

  describe("PUT /api/blogposts/:blogpostId/updateCover", () => {
    checkAuthorizeMiddleware("/api/blogposts/abc/updateCover", "put");

    it("should update the cover", async () => {
      const blogPost = await BlogPostFactory.createOne({
        cover: "cover.webp"
      });
      const authToken = await AuthFactory.generateAuthToken();

      // add the image that must be deleted at update the cover
      const cover = new BlogPostCover("cover.webp");
      await fs.promises.cp(IMAGE_FIXTURE_PATH, cover.getPath());

      await request
        .put(`/api/blogposts/${blogPost._id}/updateCover`)
        .set("Cookie", authToken)
        .attach("cover", IMAGE_FIXTURE_PATH)
        .expect(204);


      const updatedBlogPost = await BlogPostFactory.getById(
        blogPost._id.toString()
      );

      const newCover = new BlogPostCover(
        updatedBlogPost?.get("cover", null, { getters: false })
      );

      expect(
        await checkIfFileExists(newCover.getPath())
      ).toBeTruthy();

      // we expect that the old cover was deleted
      expect(
        await checkIfFileExists(cover.getPath())
      ).toBeFalsy();
    });

    describe("validation should fail when", () => {
      const callApi = async () => {
        const blogPostId = faker.database.mongodbObjectId();
        const authToken = await AuthFactory.generateAuthToken();

        return request
          .put(`/api/blogposts/${blogPostId}/updateCover`)
          .set("Cookie", authToken);
      };

      it("blogPostId doesn't exist", async () => {
        const res = await callApi();

        expect(res.statusCode).toBe(400);
        expect(res).toContainValidationError({
          field: "blogPostId",
          message: "Blog Post not found"
        });
      });

      it("cover is empty", async () => {
        const res = await callApi();

        expect(res.statusCode).toBe(400);
        expect(res).toContainValidationError({
          field: "cover",
          message: "Cover is required"
        });
      });
    });
  });
});
