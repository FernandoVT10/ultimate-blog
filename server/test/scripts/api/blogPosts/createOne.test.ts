import fs from "fs";
import path from "path";

import { BLOG_POST_COVERS_DIR, APP_STATIC_FILES_URL } from "@app/config/constants";
import { faker } from "@faker-js/faker";
import { AuthFactory, TagFactory } from "../../../factories";
import {
  checkAuthorizeMiddleware,
  convertToResponseBody,
  connectDB
} from "../../../helpers";

import request from "../../../request";

connectDB();

describe("POST /api/blogposts", () => {
  checkAuthorizeMiddleware("/api/blogposts", "post");

  const checkIfFileExists = async (filePath: string): Promise<boolean> => {
    return new Promise(resolve => {
      fs.stat(filePath, (err) => {
        if(!err) return resolve(true);
        resolve(false);
      });
    });
  };

  it("should create a blogPost", async () => {
    // we need to create the dir, since multer needs it created to save the cover.
    await fs.promises.mkdir(BLOG_POST_COVERS_DIR, { recursive: true });

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
      .attach("cover", path.resolve(__dirname, "../../../fixtures/image.png"))
      .expect(200);

    const coverName = path.basename(res.body.cover);

    const coverPath = path.resolve(BLOG_POST_COVERS_DIR, coverName);
    expect(checkIfFileExists(coverPath)).toBeTruthy();

    expect(res.body).toMatchObject({
      title,
      content,
      // TODO: this shouldn't be harcoded
      cover: `${APP_STATIC_FILES_URL}/images/blog/covers/${coverName}`,
      tags: convertToResponseBody([tagA, tagB])
    });
  });

  describe("should response with a validation error when", () => {
    const callApi = async (data: any) => {
      const authToken = await AuthFactory.generateAuthToken();

      const res = await request.post("/api/blogposts")
        .set("Cookie", authToken)
        .send(data);

      return res;
    };

    describe("Title", () => {
      it("is empty", async () => {
        const res = await callApi({ title: "" });

        expect(res).toContainValidationError({
          field: "title",
          message: "Title is required"
        });
      });

      it("is larger than 100 characters", async () => {
        const res = await callApi({
          title: faker.random.alpha(101)
        });

        expect(res).toContainValidationError({
          field: "title",
          message: "Title can't be larger than 100 characters"
        });
      });
    });

    describe("Content", () => {
      it("is empty", async () => {
        const res = await callApi({ content: "" });

        expect(res).toContainValidationError({
          field: "content",
          message: "Content is required"
        });
      });

      it("is larger than 5000 characters", async () => {
        const res = await callApi({
          content: faker.random.alpha(5001)
        });

        expect(res).toContainValidationError({
          field: "content",
          message: "Content can't be larger than 5000 characters"
        });
      });
    });

    describe("Cover", () => {
      it("is empty", async () => {
        const res = await callApi({ cover: null });

        expect(res).toContainValidationError({
          field: "cover",
          message: "Cover is required"
        });
      });
    });
  });
});
