import TagModel, { Tag } from "@app/models/Tag";
import { faker } from "@faker-js/faker";

const createOne = (data: Partial<Tag> = {}): Promise<Tag> => {
  return TagModel.create({
    name: data.name || faker.lorem.word()
  });
};

export default {
  createOne
};
