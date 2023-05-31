import BlogPostModel, { BlogPost } from "@app/models/BlogPost";

import { faker } from "@faker-js/faker";

const createOne = (data: Partial<BlogPost> = {}): Promise<BlogPost> => {
  return BlogPostModel.create({
    title: data.title || faker.lorem.words(3),
    content: data.content || faker.lorem.text(),
    cover: data.cover || faker.system.commonFileName("webp"),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    tags: data.tags || []
  });
};

export default { createOne };
