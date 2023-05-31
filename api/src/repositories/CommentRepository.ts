import CommentModel, { Comment } from "../models/Comment";
import BlogPostModel, { BlogPost } from "../models/BlogPost";

import { Model } from "mongoose";

const MODELS = {
  BlogPost: BlogPostModel,
  Comment: CommentModel
};

export interface CreateCommentData {
  authorName: Comment["authorName"];
  content: Comment["content"];
  parentId: string;
  parentModel: Comment["parentModel"];
  level: number;
}

const createOne = (data: CreateCommentData): Promise<Comment> => {
  return CommentModel.create(data);
};

const getById = async (commentId: string): Promise<Comment | null> => {
  return CommentModel.findById(commentId);
};

const getOneByParentModel = (
  id: string,
  model: Comment["parentModel"]
): Promise<BlogPost | Comment | null> => {
  // TODO: remove the any type
  // eslint-disable-next-line
  return (MODELS[model] as Model<any>).findById(id);
};

export default {
  createOne,
  getById,
  getOneByParentModel
};
