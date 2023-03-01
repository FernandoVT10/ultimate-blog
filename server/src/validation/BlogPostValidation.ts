import { TITLE_MAX_LENGTH, CONTENT_MAX_LENGTH } from "../models/BlogPost";

import { isValidObjectId } from "mongoose";
import { CustomValidator, Schema, ParamSchema } from "express-validator";
import { transformIntoStringArray } from "../utils/sanitizers";

import BlogPostService from "../services/BlogPostService";


const checkId: CustomValidator = async (id) => {
  if(!isValidObjectId(id)) throw new Error("Id is invalid");

  try {
    if(await BlogPostService.checkIfExists(id)) {
      return true;
    } 
  } catch (error) {
    // TODO: log this error correctly
    console.error(error);
  }

  throw new Error("Blog Post not found");
};

const coverValidator: CustomValidator = (_, { req }) => {
  if(!req.file) {
    throw new Error("Cover is required");
  }

  return true;
};

const titleValidation: ParamSchema = {
  in: ["body"],
  exists: {
    errorMessage: "Title is required",
    options: {
      checkNull: true,
      checkFalsy: true
    }
  },
  isString: {
    errorMessage: "Title must be a string"
  },
  isLength: {
    errorMessage: `Title can't be larger than ${TITLE_MAX_LENGTH} characters`,
    options: { max: TITLE_MAX_LENGTH }
  }
};

const contentValidation: ParamSchema = {
  in: ["body"],
  exists: {
    errorMessage: "Content is required",
    options: {
      checkNull: true,
      checkFalsy: true
    }
  },
  isString: {
    errorMessage: "Content must be a string"
  },
  isLength: {
    errorMessage: `Content can't be larger than ${CONTENT_MAX_LENGTH} characters`,
    options: { max: CONTENT_MAX_LENGTH }
  }
};

const createBlogPostSchema: Schema = {
  title: titleValidation,
  content: contentValidation,
  tags: {
    in: ["body"],
    customSanitizer: {
      options: transformIntoStringArray
    }
  },
  cover: {
    in: ["body"],
    custom: {
      options: coverValidator
    }
  }
};

const blogPostIdValidation: ParamSchema = {
  in: "params",
  custom: {
    options: checkId
  }
};

const updateBlogPostTitleSchema: Schema = {
  blogPostId: blogPostIdValidation,
  title: titleValidation
};

const updateBlogPostContentSchema: Schema = {
  blogPostId: blogPostIdValidation,
  content: contentValidation
};

export default {
  checkId,
  coverValidator,
  createBlogPostSchema,
  updateBlogPostTitleSchema,
  updateBlogPostContentSchema
};
