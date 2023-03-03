import {
  checkAuthorizeMiddleware,
  connectDB,
  convertToResponseBody
} from "../../helpers";

import {
  AUTHOR_NAME_MAX_LENGTH,
  CONTENT_MAX_LENGTH
} from "@app/models/Comment";

import {
  AuthFactory,
  BlogPostFactory,
  CommentFactory
} from "../../factories";

import { testStringValidation } from "../../helpers/validationTests";
import { faker } from "@faker-js/faker";

import request from "../../request";

connectDB();

describe("integration /api/comments", () => {
  let authToken = "";

  beforeEach(async () => {
    authToken = await AuthFactory.generateAuthToken();
  });

  describe("POST /api/comments", () => {
    const getRequest = () => request.post("/api/comments");

    describe("validation", () => {
      testStringValidation(getRequest, "authorName", {
        maxLength: AUTHOR_NAME_MAX_LENGTH,
        required: true
      });

      testStringValidation(getRequest, "content", {
        maxLength: CONTENT_MAX_LENGTH,
        required: true
      });

      it("should fail when parentType is invalid", async () => {
        const res = await getRequest()
          .send({ parentType: "invalid string" })
          .expect(400);

        expect(res).toContainValidationError({
          field: "parentType",
          message: "parentType is invalid"
        });
      });

      it("should fail when parentId is invalid", async () => {
        const res = await getRequest()
          .send({ parentId: "invalid id" })
          .expect(400);

        expect(res).toContainValidationError({
          field: "parentId",
          message: "parentId is invalid"
        });
      });

      it("should fail when the id in parentId doesn't exist", async () => {
        // case when parentType is equal to BlogPost
        let res = await getRequest()
          .send({
            parentType: "BlogPost",
            parentId: faker.database.mongodbObjectId()
          })
          .expect(400);

        expect(res).toContainValidationError({
          field: "parentId",
          message: "BlogPost matching parentId not found"
        });

        // case when parentType is equal to Comment
        res = await getRequest()
          .send({
            parentType: "Comment",
            parentId: faker.database.mongodbObjectId()
          })
          .expect(400);

        expect(res).toContainValidationError({
          field: "parentId",
          message: "Comment matching parentId not found"
        });
      });
    });

    it("should create a comment", async () => {
      const blogPost = await BlogPostFactory.createOne();

      const comment = {
        authorName: faker.internet.userName(),
        content: faker.lorem.paragraph(),
        parentType: "BlogPost",
        parentId: blogPost._id
      };

      const res = await getRequest().send(comment);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(comment);
    });
  });

  describe("DELETE /api/comments/:commentId", () => {
    checkAuthorizeMiddleware("/api/comments/abc", "delete");

    const getRequest = (commentId: string) => request
      .delete(`/api/comments/${commentId}`)
      .set("Cookie", authToken);

    describe("validation", () => {
      it("should fail when commentId is invalid", async () => {
        const res = await getRequest("invalid id").expect(400);

        expect(res).toContainValidationError({
          field: "commentId",
          message: "commentId is invalid"
        });
      });

      it("should fail when commentId doesn't exist", async () => {
        const res = await getRequest(faker.database.mongodbObjectId()).expect(400);

        expect(res).toContainValidationError({
          field: "commentId",
          message: "Comment not found"
        });
      });
    });

    it("should delete a comment", async () => {
      const comment = await CommentFactory.createOne();

      const res = await getRequest(comment._id.toString())
        .expect(200);

      expect(res.body).toEqual(convertToResponseBody(comment));
    });
  });

  describe("GET /api/comments", () => {
    it("should get all comments", async () => {
      const blogPost = await BlogPostFactory.createOne();

      const commentA = await CommentFactory.createOne({
        parentType: "BlogPost",
        parentId: blogPost._id
      });

      const commentB = await CommentFactory.createOne({
        parentType: "BlogPost",
        parentId: blogPost._id
      });

      const res = await request.get("/api/comments").query({
        parentId: blogPost._id.toString()
      }).expect(200);

      expect(res.body).toEqual(
        convertToResponseBody([commentA, commentB])
      );
    });
  });

  it("should fail when parentId is invalid", async () => {
    const res = await request.get("/api/comments").query({
      parentId: "abc"
    }).expect(400);

    expect(res).toContainValidationError({
      field: "parentId",
      message: "parentId is invalid"
    });
  });
});
