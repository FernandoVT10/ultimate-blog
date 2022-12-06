import fs from "fs";
import path from "path";
import request from "../../../request";

import BlogPostCover from "@app/lib/BlogPostCover";

import { faker } from "@faker-js/faker";
import { AuthFactory, TagFactory } from "../../../factories";
import {
  checkAuthorizeMiddleware,
  convertToResponseBody,
  connectDB,
  checkIfFileExists
} from "../../../helpers";

const IMAGE_FIXTURE_PATH = path.resolve(__dirname, "../../../fixtures/image.png");

connectDB();

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
