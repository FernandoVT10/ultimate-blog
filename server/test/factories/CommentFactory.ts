import Comment, { IComment } from "@app/models/Comment";

import { faker } from "@faker-js/faker";
import { HydratedDocument } from "mongoose";

import BlogPostFactory from "./BlogPostFactory";

const createOne = async (): Promise<HydratedDocument<IComment>> => {
  const blogPost = await BlogPostFactory.createOne();

  return Comment.create({
    authorName: faker.internet.userName(),
    content: faker.lorem.paragraph(),
    repliedToModel: "BlogPost",
    repliedTo: blogPost._id
  });
};

export default {
  createOne
};
