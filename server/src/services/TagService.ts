import { HydratedDocument } from "mongoose";
import Tag, { ITag } from "../models/Tag";

const getTagsByName = async (names: string[]): Promise<HydratedDocument<ITag>[]> => {
  return Tag.find({ name: { $in: names } });
};

export default {
  getTagsByName
};
