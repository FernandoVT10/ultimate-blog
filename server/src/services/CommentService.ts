import { HydratedDocument } from "mongoose";

import Comment, { IComment } from "../models/Comment";

interface CreateCommentData {
  authorName: IComment["authorName"];
  content: IComment["authorName"];
  parentType: IComment["parentType"];
  parentId: string;
}

const create = (data: CreateCommentData): Promise<HydratedDocument<IComment>> => {
  return Comment.create(data);
};

const checkIfExists = async (id: string): Promise<boolean> => {
  return await Comment.exists({ _id: id }) !== null;
};

const deleteById = async (commentId: string): Promise<HydratedDocument<IComment>> => {
  return await Comment.findByIdAndDelete(commentId) as HydratedDocument<IComment>;
};

export default {
  checkIfExists,
  create,
  deleteById
};
