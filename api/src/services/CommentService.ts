import { RequestError } from "../utils/errors";
import { Comment } from "../models/Comment";

import CommentRepository, { CreateCommentData } from "../repositories/CommentRepository";

const MAX_NEST_LEVEL = 3;

const createOne = async (data: Omit<CreateCommentData, "level">) => {
  let level = 1;

  // updates comment nest level
  if(data.parentModel === "Comment") {
    const parentComment = await CommentRepository.getById(
      data.parentId
    );

    if(!parentComment) throw new RequestError(500);

    level = parentComment.level + 1;
  }

  return CommentRepository.createOne({
    ...data,
    level
  });
};

const getById = async (commentId: string) => {
  return CommentRepository.getById(commentId);
};

const checkNestLevel = async (
  parentId: string,
  parentModel: Comment["parentModel"]
): Promise<boolean> => {
  if(parentModel !== "Comment") return true;

  const comment = await CommentRepository.getById(parentId);

  if(comment?.level === MAX_NEST_LEVEL) {
    return false;
  }

  return true;
};

const existsByIdAndModel = (
  parentId: string,
  parentModel: Comment["parentModel"]
): Promise<boolean> => {
  return CommentRepository.checkModelAndIdExists(parentId, parentModel);
};

type CommentWithRepliesCount = Comment & {
  repliesCount?: number;
};

const getAllByIdAndModel = async (
  parentId: string,
  parentModel: string
): Promise<CommentWithRepliesCount[]> => {
  const comments = await CommentRepository.getAllByIdAndModel(
    parentId,
    parentModel as Comment["parentModel"]
  ) as CommentWithRepliesCount[];

  for(const commentIndex in comments) {
    const comment = comments[commentIndex];

    const count = await CommentRepository.countReplies(
      comment._id.toString()
    );

    comments[commentIndex].repliesCount = count;
  }

  return comments;
};

const deleteOneById = async (commentId: string) => {
  return CommentRepository.deleteOneById(commentId);
};

export default {
  createOne,
  getById,
  checkNestLevel,
  existsByIdAndModel,
  getAllByIdAndModel,
  deleteOneById
};
