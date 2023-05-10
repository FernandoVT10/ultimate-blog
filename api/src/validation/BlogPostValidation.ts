import sharp from "sharp";

import { TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH } from "../models/BlogPost";
import { CustomValidator, body } from "express-validator";

import validators from "../utils/validators";
import sanitizers from "../utils/sanitizers";

// const checkId: CustomValidator = async (id) => {
//   if(!isValidObjectId(id)) throw new Error("Id is invalid");
//
//   try {
//     if(await BlogPostService.checkIfExists(id)) {
//       return true;
//     } 
//   } catch (error) {
//     // TODO: log this error correctly
//     console.error(error);
//   }
//
//   throw new Error("Blog Post not found");
// };

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

// const blogPostIdValidation: ParamSchema = {
//   in: "params",
//   custom: {
//     options: checkId
//   }
// };
//
// const updateBlogPostTitleSchema: Schema = {
//   blogPostId: blogPostIdValidation,
//   title: titleValidation
// };
//
// const updateBlogPostContentSchema: Schema = {
//   blogPostId: blogPostIdValidation,
//   content: contentValidation
// };

export default {
  createCoverChain,
  createTitleChain,
  createContentChain,
  createTagsChain
};
