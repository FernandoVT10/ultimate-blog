import {
  body,
  query,
  param,
  CustomValidator,
  ValidationChain,
  matchedData
} from "express-validator";
import {
  AUTHOR_NAME_MAX_LENGTH,
  PARENT_MODELS,
  CONTENT_MAX_LENGTH
} from "../models/Comment";
import { RequestError } from "../utils/errors";

import CommentService from "../services/CommentService";
import validators from "../utils/validators";

const createAuthorNameChain = (): ValidationChain =>
  validators.stringValidator("authorName", AUTHOR_NAME_MAX_LENGTH);

const createContentChain = (): ValidationChain =>
  validators.stringValidator("content", CONTENT_MAX_LENGTH);

const createParentModelChain = (isQuery = false): ValidationChain =>
  (isQuery ? query : body)("parentModel")
    .isIn(PARENT_MODELS)
    .withMessage("model name must be a valid one")
    // important, avoids the execution of the parentIdValidator that will throw if
    // parentModel is invalid
    .bail({ level: "request" });

const parentIdValidator: CustomValidator = async (parentId, { req }) => {
  const { parentModel } = matchedData(req);

  const exists = await CommentService.existsByIdAndModel(parentId, parentModel);

  if(!exists) {
    req.requestError = new RequestError(404, `${parentModel.toLowerCase()} not found`); 
    return false;
  }

  const validNestLevel = await CommentService.checkNestLevel(parentId, parentModel);

  if(!validNestLevel) {
    throw new Error("you can't nest another comment");
  }

  return true;
};

const createParentIdChain = (isQuery = false): ValidationChain =>
  (isQuery ? query : body)("parentId")
    .custom(validators.validateId)
    .custom(parentIdValidator);

const commentIdValidator: CustomValidator = async (commentId, { req }) => {
  const comment = await CommentService.getById(commentId);

  if(!comment) {
    req.requestError = new RequestError(404, "comment not found");
    return false;
  }

  return true;
};

const createCommentIdChain = (): ValidationChain =>
  param("commentId")
    .custom(validators.validateId)
    .custom(commentIdValidator);

export default {
  createAuthorNameChain,
  createContentChain,
  createParentModelChain,
  createParentIdChain,
  createCommentIdChain
};
