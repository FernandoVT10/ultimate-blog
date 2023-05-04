import { HydratedDocument } from "mongoose";
import Tag, { ITag } from "../models/Tag";

const getAll = async (): Promise<HydratedDocument<ITag>[]> => {
  return Tag.find();
};

const createOne = async (name: string): Promise<HydratedDocument<ITag>> => {
  return Tag.create({ name });
};

const checkNameExists = async (name: string): Promise<boolean> => {
  try {
    if(await Tag.exists({ name })) return true;

    return false;
  } catch {
    // TODO: return a Server Error instead
    return false;
  }
};

export default { getAll, createOne, checkNameExists };
