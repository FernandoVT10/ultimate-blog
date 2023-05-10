import fs from "fs";
import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";
import generators from "../../utils/generators";

import { SuperAgentTest } from "supertest";
import { BlogPostFactory } from "../../factories";
import { createAuthorizedAgent } from "../../utils/request";
import { faker } from "@faker-js/faker";

import BlogPostCover from "@app/utils/BlogPostCover";
import BlogPost from "@app/models/BlogPost";

describe("PUT /api/blogposts/:blogpostId/updateCover", () => {
  let authenticatedRequest: SuperAgentTest;
  
  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/blogposts/abc/updateCover", "put");

  it("should update the cover", async () => {
    const blogPost = await BlogPostFactory.createOne({
      cover: "cover.webp"
    });

    // if the dir is not created we're going to get a ENOENT error
    await fs.promises.mkdir(BlogPostCover.BASE_PATH, { recursive: true });

    // add the image that must be deleted at update the cover
    const cover = new BlogPostCover("cover.webp");
    await cover.saveBuffer(await generators.generateImageBuffer());

    const coverBuffer = await generators.generateImageBuffer();

    await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateCover`)
      .attach("cover", coverBuffer, { filename: "cover.png" })
      .expect(204);

    const updatedBlogPost = await BlogPost.findById(blogPost._id);

    const newCover = new BlogPostCover(
      updatedBlogPost?.get("cover", null, { getters: false })
    );

    expect(await newCover.coverExists()).toBeTruthy();

    // we expect that the old cover was deleted
    expect(await cover.coverExists()).toBeFalsy();
  });


  it("should fail when cover is not an attached", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateCover`)
      .expect(400);

    expect(res.body.errors[0].message).toBe("cover is required");
  });

  it("should fail when cover is not an image", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const invalidCoverBuffer = Buffer.from([1, 2, 3]);
    const res = await authenticatedRequest
      .put(`/api/blogposts/${blogPost._id}/updateCover`)
      .attach("cover", invalidCoverBuffer, {
        filename: "test.jpg",
      })
      .expect(400);

    expect(res.body.errors[0].message).toBe(
      "cover file must be an image"
    );
  });

  // TODO: somehow share this test cases with the ones in updateContent and updateTitle
  it("should fail when blogPostId is invalid", async () => {
    const coverBuffer = await generators.generateImageBuffer();

    const res = await authenticatedRequest
      .put("/api/blogposts/abc/updateCover")
      .attach("cover", coverBuffer, { filename: "cover.png" })
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });

  it("should return a 404", async () => {
    const coverBuffer = await generators.generateImageBuffer();
    const fakeId = faker.database.mongodbObjectId();

    const res = await authenticatedRequest
      .put(`/api/blogposts/${fakeId}/updateCover`)
      .attach("cover", coverBuffer, { filename: "cover.png" })
      .expect(404);

    expect(res.body.errors).toHaveLength(1);
  });
});
