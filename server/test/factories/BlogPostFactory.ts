import BlogPost, { IBlogPost } from "@app/models/BlogPost";
import { HydratedDocument } from "mongoose";

import { faker } from "@faker-js/faker";

const createOne = (data: Partial<IBlogPost> = {}): Promise<HydratedDocument<IBlogPost>> => {
  return BlogPost.create({
    title: data.title || faker.lorem.words(3),
    content: data.content || faker.lorem.text(),
    cover: data.cover || faker.internet.url(),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    tags: data.tags || []
  });
};

export default {
  createOne
};
