import { HydratedDocument } from "mongoose";
import Tag, { ITag } from "../models/Tag";

const getAll = async (): Promise<HydratedDocument<ITag>[]> => {
  return Tag.find();
};

const createOne = async (name: ITag["name"]) => {
  return Tag.create({ name });
};

const getTagsByName = async (names: string[]): Promise<HydratedDocument<ITag>[]> => {
  return Tag.find({ name: { $in: names } });
};

const checkNameExists = async (name: string): Promise<boolean> => {
  try {
    if(await Tag.exists({ name })) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
};

export default {
  getAll,
  createOne,
  getTagsByName,
  checkNameExists
};
