import { createRequest } from "../../utils/request";

import CommentFactory from "../../factories/CommentFactory";

const request = createRequest();

it.todo("in the future");

// describe("GET /api/comments/:commentId", () => {
//   it("should get all comments nested into a comment", async () => {
//     const parentComment = await CommentFactory.createOne();
//
//     const commentA = await CommentFactory.createOne({
//       parentId: parentComment._id,
//       parentModel: "Comment"
//     });
//
//     const commentB = await CommentFactory.createOne({
//       parentId: parentComment._id,
//       parentModel: "Comment"
//     });
//
//     const res = await request
//       .get(`/api/comments/${parentComment._id}`)
//       .expect(200);
//
//     expect(res.body).toHaveLength(2);
//
//     expect(res.body).toContainEqual(expect.objectContaining({
//       authorName: commentA.authorName,
//       content: commentA.content
//     }));
//
//     expect(res.body).toContainEqual(expect.objectContaining({
//       authorName: commentB.authorName,
//       content: commentB.content
//     }));
//   });
// });
