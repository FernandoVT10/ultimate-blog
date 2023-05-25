import Comment, { IComment } from "../models/Comment";
import { HydratedDocument, Model} from "mongoose";

import BlogPost, { IBlogPost } from "../models/BlogPost";

// eslint-disable-next-line @typescript-eslint/no-explicit-any 
const MODELS: {[key in IComment["parentModel"]]: Model<any>} = {
  BlogPost: BlogPost,
  Comment: Comment
};

export interface CreateCommentData {
  authorName: IComment["authorName"];
  content: IComment["content"];
  parentId: string;
  parentModel: IComment["parentModel"];
  level: number;
}

const createOne = (data: CreateCommentData): Promise<HydratedDocument<IComment>> => {
  return Comment.create(data);
};

const getById = async (commentId: string): Promise<HydratedDocument<IComment> | null> => {
  return Comment.findById(commentId);
};

type GetOneByModelReturn = Promise<
  HydratedDocument<IBlogPost>
  | HydratedDocument<IComment>
  | null>;


const getOneByParentModel = async (
  id: string,
  model: IComment["parentModel"]
): GetOneByModelReturn => {
  return MODELS[model].findById(id);
};

export default {
  createOne,
  getById,
  getOneByParentModel
};
