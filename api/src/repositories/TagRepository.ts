import TagModel, { Tag } from "../models/Tag";

const getAll = async (): Promise<Tag[]> => {
  return TagModel.find();
};

const createOne = async (name: string): Promise<Tag> => {
  return TagModel.create({ name });
};

const checkNameExists = async (name: string): Promise<boolean> => {
  try {
    if(await TagModel.exists({ name })) return true;

    return false;
  } catch {
    return false;
  }
};

const getTagsByName = async (names: string[]): Promise<Tag[]> => {
  return TagModel.find({ name: { $in: names } });
};

export default { getAll, createOne, checkNameExists, getTagsByName };
