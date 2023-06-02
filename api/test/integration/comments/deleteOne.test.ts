import { SuperAgentTest } from "supertest";
import { createAuthorizedAgent } from "../../utils/request";
import { faker } from "@faker-js/faker";

import checkAuthorizeMiddleware from "../../utils/checkAuthorizationMiddleware";
import CommentFactory from "../../factories/CommentFactory";
import CommentModel from "@app/models/Comment";

describe("DELETE /api/comments/:commentId", () => {
  let authenticatedRequest: SuperAgentTest;

  beforeEach(async () => {
    authenticatedRequest = await createAuthorizedAgent();
  });

  checkAuthorizeMiddleware("/api/comments/abc", "delete");

  it("should delete a comment with all its nested comments", async () => {
    const parentComment = await CommentFactory.createOne();

    const commentA = await CommentFactory.createOne({
      parentId: parentComment._id,
      parentModel: "Comment"
    });

    const commentB = await CommentFactory.createOne({
      parentId: parentComment._id,
      parentModel: "Comment"
    });

    const res = await authenticatedRequest
      .delete(`/api/comments/${parentComment._id}`)
      .expect(200);

    expect(res.body.authorName).toBe(parentComment.authorName);

    expect(
      await CommentModel.exists({ _id: commentA._id })
    ).toBeFalsy();

    expect(
      await CommentModel.exists({ _id: commentB._id })
    ).toBeFalsy();
  });

  it("should return 404", async () => {
    const res = await authenticatedRequest.delete(
      `/api/comments/${faker.database.mongodbObjectId()}`
    );

    expect(res.statusCode).toBe(404);
  });
});
