import Tag, { ITag } from "@app/models/Tag";
import { faker } from "@faker-js/faker";
import { HydratedDocument } from "mongoose";

const createOne = (data: Partial<ITag> = {}): Promise<HydratedDocument<ITag>> => {
  return Tag.create({
    name: data.name || faker.lorem.word()
  });
};

export default {
  createOne
};
