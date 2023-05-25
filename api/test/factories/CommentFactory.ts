import Comment, { IComment } from "@app/models/Comment";
import { HydratedDocument } from "mongoose";

import { faker } from "@faker-js/faker";

import BlogPostFactory from "./BlogPostFactory";

const getParentId = async () => {
  const blogPost = await BlogPostFactory.createOne();
  return blogPost._id;
};

const createOne = async (data: Partial<IComment> = {}): Promise<HydratedDocument<IComment>> => {
  return Comment.create({
    authorName: data.authorName || faker.name.firstName(),
    content: data.content || faker.lorem.words(5),
    parentModel: data.parentModel || "BlogPost",
    parentId: data.parentId || await getParentId(),
    level: data.level
  });
};

export default { createOne };
