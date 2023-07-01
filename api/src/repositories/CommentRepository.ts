import CommentModel, { Comment } from "../models/Comment";
import BlogPostModel from "../models/BlogPost";

import { Model } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODELS: {[key: string]: Model<any>} = {
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

// this function check if a document exists using the models in the array
// declared above
const checkModelAndIdExists = async (
  id: string,
  model: Comment["parentModel"]
): Promise<boolean> => {
  const doc = await MODELS[model].exists({ _id: id });

  if(doc === null) return false;
  return true;
};

const getAllByIdAndModel = async (
  id: string,
  model: Comment["parentModel"]
): Promise<Comment[]> => {
  return CommentModel
    .find({
      parentId: id,
      parentModel: model
    }, { comments: 0 })
    .sort({ createdAt: "descending" })
    .lean();
};

const deleteOneById = async (commentId: string): Promise<Comment | null> => {
  return CommentModel.findByIdAndDelete(commentId);
};

const countReplies = async (commentId: string): Promise<number> => {
  const count = await CommentModel.countDocuments({
    parentId: commentId,
    parentModel: "Comment"
  });

  return count;
};

export default {
  createOne,
  getById,
  checkModelAndIdExists,
  getAllByIdAndModel,
  deleteOneById,
  countReplies
};