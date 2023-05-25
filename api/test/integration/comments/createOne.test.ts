import { faker } from "@faker-js/faker";
import { BlogPostFactory } from "../../factories";
import { createRequest } from "../../utils/request";

import CommentFactory from "../../factories/CommentFactory";

const request = createRequest();

describe("POST /api/comments", () => {
  it("should create a comment", async () => {
    const blogPost = await BlogPostFactory.createOne();

    const data = {
      authorName: faker.name.firstName(),
      content: faker.lorem.words(5),
      parentId: blogPost._id,
      parentModel: "BlogPost"
    };

    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(200);

    expect(res.body.authorName).toBe(data.authorName);
    expect(res.body.content).toBe(data.content);
    expect(res.body.parentModel).toBe("BlogPost");
    expect(res.body.parentId).toBe(blogPost._id.toString());
    expect(res.body.level).toBe(1);
  });

  it("should create a comment with level 3", async () => {
    const comment = await CommentFactory.createOne({
      level: 2
    });

    const data = {
      authorName: faker.name.firstName(),
      content: faker.lorem.words(5),
      parentId: comment._id,
      parentModel: "Comment"
    };

    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(200);

    expect(res.body.level).toBe(3);
  });

  it("should fail with invalid data", async () => {
    const data = {
      authorName: "",
      content: "",
      parentId: "invalid id",
      parentModel: "invalid model"
    };


    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(400);

    // three because when the parentId validation fails parent model validation is not
    // executed
    expect(res.body.errors).toHaveLength(3);
  });

  it("should create one when the parent is another comment", async () => {
    const comment = await CommentFactory.createOne();

    const data = {
      authorName: faker.name.firstName(),
      content: faker.lorem.words(5),
      parentId: comment._id,
      parentModel: "Comment"
    };

    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(200);

    expect(res.body.authorName).toBe(data.authorName);
    expect(res.body.content).toBe(data.content);
    expect(res.body.parentModel).toBe("Comment");
    expect(res.body.parentId).toBe(comment._id.toString());
  });

  it("should fail when the parent comment is nested at level 3", async () => {
    const commentA = await CommentFactory.createOne();
    const commentB = await CommentFactory.createOne({
      parentModel: "Comment",
      parentId: commentA._id,
      level: 3
    });

    const data = {
      authorName: faker.name.firstName(),
      content: faker.lorem.words(5),
      parentId: commentB._id,
      parentModel: "Comment"
    };

    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(400);

    expect(res.body.errors[0].message).toBe("you can't nest another comment");
  });

  it("should fail when parent model is invalid", async () => {
    const data = {
      authorName: faker.name.firstName(),
      content: faker.lorem.words(5),
      parentId: faker.database.mongodbObjectId(),
      parentModel: "abc"
    };

    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(400);

    expect(res.body.errors[0].message).toBe("model name must be a valid one");
    expect(res.body.errors).toHaveLength(1);
  });

  it("should fail when no match of the parent model and id is found", async () => {
    const data = {
      authorName: faker.name.firstName(),
      content: faker.lorem.words(5),
      parentId: faker.database.mongodbObjectId(),
      parentModel: "Comment"
    };

    const res = await request
      .post("/api/comments")
      .send(data)
      .expect(404);

    expect(res.body.errors[0].message).toBe("comment not found");
  });
});
