import fs from "fs";
import path from "path";
import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";
import generators from "../../utils/generators";
import BlogPostCover from "@app/utils/BlogPostCover";

import { createAuthorizedAgent } from "../../utils/request";
import { TagFactory } from "../../factories";
import { faker } from "@faker-js/faker";
import { SuperAgentTest } from "supertest";

describe("integration POST /api/blogposts", () => {
  let authenticatedRequest: SuperAgentTest;
  
  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/blogposts", "post");

  it("should create a blogPost", async () => {
    // if the dir is not created we're going to get a ENOENT error
    await fs.promises.mkdir(BlogPostCover.BASE_PATH, { recursive: true });

    const tagA = await TagFactory.createOne();
    const tagB = await TagFactory.createOne();

    const title = faker.lorem.words(3);
    const content = faker.lorem.sentence();
    const cover = await generators.generateImageBuffer();

    const res = await authenticatedRequest.post("/api/blogposts")
      .field("title", title)
      .field("content", content)
      .field("tags", [tagA.name, tagB.name])
      .attach("cover", cover, { filename: "cover.png" })
      .expect(200);

    const blogPost = res.body;

    // getting only the cover name since the api returns the entire url
    const coverName = path.basename(blogPost.cover);
    const blogPostCover = new BlogPostCover(coverName);
    expect(await blogPostCover.coverExists()).toBeTruthy();

    expect(blogPost).toMatchObject({ title, content });
    expect(blogPost.tags).toHaveLength(2);
  });

  it("should fail when data is invalid", async () => {
    const invalidCoverBuffer = Buffer.from([1, 2, 3]);

    const res = await authenticatedRequest
      .post("/api/blogposts")
      .field("title", "")
      .field("description", "")
      .attach("cover", invalidCoverBuffer, { filename: "cover.webp" });

    expect(res.body.errors).toHaveLength(3);
  });

  it("should fail when cover is not an attached", async () => {
    const res = await authenticatedRequest
      .post("/api/blogposts")
      .expect(400);

    expect(res.body.errors[0].message).toBe("cover is required");
  });

  it("should fail when cover is not an image", async () => {
    const invalidCoverBuffer = Buffer.from([1, 2, 3]);
    const res = await authenticatedRequest.post("/api/blogposts")
      .attach("cover", invalidCoverBuffer, {
        filename: "test.jpg",
        contentType: "text"
      })
      .expect(400);

    expect(res.body.errors[0].message).toBe(
      "cover file must be an image"
    );
  });
});
