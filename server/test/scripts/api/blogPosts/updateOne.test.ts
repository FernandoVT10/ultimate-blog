import request from "../../../request";
import fs from "fs";
import path from "path";
import pathTransformers from "@app/utils/pathTransformers";

import {
  checkAuthorizeMiddleware,
  convertToResponseBody,
  checkIfFileExists,
  connectDB
} from "../../../helpers";
import { faker } from "@faker-js/faker";
import { AuthFactory, BlogPostFactory, TagFactory } from "../../../factories";
import { BLOG_POST_COVERS_DIR } from "@app/config/constants";

connectDB();

describe("PUT /api/blogposts/:blogPostId", () => {
  checkAuthorizeMiddleware(
    `/api/blogposts/${faker.database.mongodbObjectId()}`,
    "put"
  );

  const callApi = async (data: any, blogPostId?: string) => {
    if(!blogPostId) {
      const blogPost = await BlogPostFactory.createOne();
      blogPostId = blogPost._id.toString();
    }

    const authToken = await AuthFactory.generateAuthToken();

    const res = await request.put(`/api/blogposts/${blogPostId}`)
      .set("Cookie", authToken)
      .send(data);

    return res;
  };

  describe("should update", () => {
    it("the title", async () => {
      const title = faker.lorem.words(3);

      const res = await callApi({ title });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe(title);
    });

    it("the content", async () => {
      const content = faker.lorem.sentence();

      const res = await callApi({ content });
      expect(res.status).toBe(200);
      expect(res.body.content).toBe(content);
    });

    describe("tags", () => {
      it("should add 0 tags when the tags don't exist", async () => {
        const res = await callApi({ tags: ["asdjfk", "sdjfk"] });
        expect(res.status).toBe(200);
        expect(res.body.tags).toHaveLength(0);
      });

      it("should add tags", async () => {
        const tagA = await TagFactory.createOne();
        const tagB = await TagFactory.createOne();

        const res = await callApi({ tags: [tagA.name, tagB.name] });
        expect(res.status).toBe(200);

        expect(res.body.tags).toEqual(
          convertToResponseBody([ tagA, tagB ])
        );
      });
    });
    
    it("the cover", async () => {
      const authToken = await AuthFactory.generateAuthToken();

      const fixtureImagePath = path.resolve(__dirname, "../../../fixtures/image.png");
      const coverPath = path.resolve(BLOG_POST_COVERS_DIR, "cover.png");

      // copy test cover to the blog post covers folder
      await fs.promises.mkdir(BLOG_POST_COVERS_DIR, { recursive: true });
      await fs.promises.cp(fixtureImagePath, coverPath);

      const coverURL = pathTransformers.transformPathToURL(coverPath);

      const blogPost = await BlogPostFactory.createOne({
        cover: coverURL
      });

      const res = await request.put(`/api/blogposts/${blogPost._id}`)
        .set("Cookie", authToken)
        .attach("cover", fixtureImagePath);

      const newCoverURL = res.body.cover;
      expect(newCoverURL).not.toBe(coverURL);

      expect(await checkIfFileExists(coverPath)).toBeFalsy();
      expect(
        await checkIfFileExists(
          pathTransformers.transformURLToPath(newCoverURL)
        )
      ).toBeTruthy();
    });
  });

  it("shouldn't update tags if the field is undefined", async () => {
    const tagA = await TagFactory.createOne();

    const blogPost = await BlogPostFactory.createOne({
      tags: [tagA]
    });

    const res = await callApi({ tags: undefined }, blogPost._id.toString());

    expect(res.status).toBe(200);
    expect(res.body.tags).toEqual(
      convertToResponseBody([ tagA ])
    );
  });

  describe("should response with a 400 when", () => {
    it("blogPostId is invalid", async () => {
      const res = await callApi({}, "abc");

      expect(res.status).toBe(400);

      expect(res).toContainValidationError({
        field: "blogPostId",
        message: "Id is invalid"
      });
    });

    it("blogPostId doesn't exist", async () => {
      const res = await callApi({}, faker.database.mongodbObjectId());

      expect(res.status).toBe(400);

      expect(res).toContainValidationError({
        field: "blogPostId",
        message: "Blog Post not found"
      });
    });
  });

  describe("should response with a validation error when", () => {
    describe("title", () => {
      it("it's not a string", async () => {
        const res = await callApi({
          title: { obj: "foo" }
        });

        expect(res).toContainValidationError({
          field: "title",
          message: "Title must be string"
        });
      });

      it("it's larger than 100 characters", async () => {
        const res = await callApi({
          title: faker.random.alpha(101)
        });

        expect(res).toContainValidationError({
          field: "title",
          message: "Title can't be larger than 100 characters"
        });
      });
    });

    describe("content", () => {
      it("it's not a string", async () => {
        const res = await callApi({
          content: { obj: "foo" }
        });

        expect(res).toContainValidationError({
          field: "content",
          message: "Content must be string"
        });
      });

      it("it's larger than 5000 characters", async () => {
        const res = await callApi({
          content: faker.random.alpha(5001)
        });

        expect(res).toContainValidationError({
          field: "content",
          message: "Content can't be larger than 5000 characters"
        });
      });
    });
  });
});
