import { body, CustomValidator, ValidationChain } from "express-validator";
import { RequestError } from "../utils/errors";
import {
  AUTHOR_NAME_MAX_LENGTH,
  PARENT_MODELS,
  CONTENT_MAX_LENGTH
} from "../models/Comment";

import validators from "../utils/validators";

import CommentService from "../services/CommentService";

const createAuthorNameChain = (): ValidationChain =>
  validators.stringValidator("authorName", AUTHOR_NAME_MAX_LENGTH);

const createContentChain = (): ValidationChain =>
  validators.stringValidator("content", CONTENT_MAX_LENGTH);

const parentIdValidator: CustomValidator = async (parentId, { req }) => {
  const { parentModel } = req.body;

  const exists = await CommentService.existsByModel(parentId, parentModel);

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

const createParentModelChain = (): ValidationChain =>
  body("parentModel")
    .isIn(PARENT_MODELS)
    .withMessage("model name must be a valid one")
    // important, avoids the execution of the parentIdValidator that will throw if
    // parentModel is invalid
    .bail({ level: "request" });

const createParentIdChain = (): ValidationChain =>
  body("parentId")
    .custom(validators.validateId)
    .custom(parentIdValidator);

export default {
  createAuthorNameChain,
  createContentChain,
  createParentModelChain,
  createParentIdChain
};
