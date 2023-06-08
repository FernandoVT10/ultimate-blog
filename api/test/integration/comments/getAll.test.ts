import { faker } from "@faker-js/faker";
import { createRequest } from "../../utils/request";

import CommentFactory from "../../factories/CommentFactory";
import { BlogPostFactory } from "../../factories";

const request = createRequest();

describe("GET /api/comments/", () => {
  it("should get all comments from a blog post", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const actualDate = Date.now();

    const commentA = await CommentFactory.createOne({
      parentModel: "BlogPost",
      parentId: blogPost._id,
      createdAt: new Date(actualDate)
    });

    const commentB = await CommentFactory.createOne({
      parentModel: "BlogPost",
      parentId: blogPost._id,
      createdAt: new Date(actualDate - 10000)
    });

    const commentC = await CommentFactory.createOne({
      parentModel: "BlogPost",
      parentId: blogPost._id,
      createdAt: new Date(actualDate + 10000)
    });

    const res = await request.get("/api/comments")
      .query({
        parentModel: "BlogPost",
        parentId: blogPost._id.toString()
      })
      .expect(200);

    expect(res.body).toHaveLength(3);

    // this will test that the comments were sorted from newest to oldest
    expect(res.body[0].authorName).toBe(commentC.authorName);
    expect(res.body[1].authorName).toBe(commentA.authorName);
    expect(res.body[2].authorName).toBe(commentB.authorName);
  });

  it("should get all the replies from a comment", async () => {
    const commentParent = await CommentFactory.createOne();

    const comment = await CommentFactory.createOne({
      parentModel: "Comment", parentId: commentParent._id
    });

    const res = await request.get("/api/comments")
      .query({
        parentModel: "Comment",
        parentId: commentParent._id.toString()
      })
      .expect(200);

    expect(res.body[0].authorName).toBe(comment.authorName);
  });

  it("shouldn't get the 'comments' property", async () => {
    const commentParent = await CommentFactory.createOne();

    await CommentFactory.createOne({
      parentModel: "Comment", parentId: commentParent._id
    });

    const res = await request.get("/api/comments")
      .query({
        parentModel: "Comment",
        parentId: commentParent._id.toString()
      })
      .expect(200);

    expect(res.body[0].comments).toBeUndefined();
  });

  it("should return the number of replies", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const commentParent = await CommentFactory.createOne({
      parentId: blogPost._id,
      parentModel: "BlogPost"
    });

    await CommentFactory.createOne({
      parentModel: "Comment", parentId: commentParent._id
    });

    await CommentFactory.createOne({
      parentModel: "Comment", parentId: commentParent._id
    });

    const res = await request.get("/api/comments")
      .query({
        parentModel: "BlogPost",
        parentId: blogPost._id.toString()
      })
      .expect(200);

    expect(res.body[0].repliesCount).toBe(2);
  });

  it("should fail when parent model is invalid", async () => {
    const query = {
      parentModel: "invalid model"
    };

    const res = await request
      .get("/api/comments")
      .query(query)
      .expect(400);

    expect(res.body.errors).toHaveLength(1);
  });

  it("should fail when no match of the parent model and id is found", async () => {
    const query = {
      parentId: faker.database.mongodbObjectId().toString(),
      parentModel: "Comment"
    };

    const res = await request
      .get("/api/comments")
      .query(query)
      .expect(404);

    expect(res.body.errors[0].message).toBe("comment not found");
  });
});
