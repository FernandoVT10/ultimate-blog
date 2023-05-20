import sharp from "sharp";
import asyncHandler from "express-async-handler";
import validators from "../utils/validators";
import sanitizers from "../utils/sanitizers";

import { TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH } from "../models/BlogPost";
import { CustomValidator, body, param } from "express-validator";
import { RequestHandler } from "express";
import { RequestError } from "../utils/errors";

import BlogPostRepository from "../repositories/BlogPostRepository";

const coverValidator: CustomValidator = async (_, { req }) => {
  const cover = req.file as Express.Multer.File;

  if(!cover) {
    throw new Error("cover is required");
  }

  try {
    await sharp(cover.buffer).metadata();
  } catch (error) {
    throw new Error("cover file must be an image");
  }

  return true;
};

const createCoverChain = () =>
  body("cover").custom(coverValidator);

const createTitleChain = () => 
  validators.stringValidator("title", TITLE_MAX_LENGTH);

const createContentChain = () =>
  validators.stringValidator("content", CONTENT_MAX_LENGTH);

const createTagsChain = () =>
  body("tags").customSanitizer(
    sanitizers.transformIntoStringArray
  );

const createPostIdChain = () =>
  param("blogPostId").custom(validators.validateId);

// must to be ran after the id validation
const existsBlogPost = (): RequestHandler => asyncHandler(async (req, _, next) => {
  const { blogPostId } = req.params;

  if(await BlogPostRepository.getById(blogPostId)) {
    return next();
  }

  next(new RequestError(404, "blog post not found"));
});

export default {
  createCoverChain,
  createTitleChain,
  createContentChain,
  createTagsChain,
  createPostIdChain,
  existsBlogPost
};
