import { HydratedDocument } from "mongoose";
import Tag, { ITag } from "../models/Tag";

const getAll = async (): Promise<HydratedDocument<ITag>[]> => {
  return Tag.find();
};

export default { getAll };
