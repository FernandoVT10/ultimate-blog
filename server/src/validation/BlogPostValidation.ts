import modelsConfig from "../config/models";

import { isValidObjectId } from "mongoose";
import { CustomValidator, Schema } from "express-validator";
import { transformIntoStringArray } from "../utils/sanitizers";

import BlogPostService from "../services/BlogPostService";

const TITLE_MAX_LENGTH = modelsConfig.blogPost.title.maxLength;
const CONTENT_MAX_LENGTH = modelsConfig.blogPost.content.maxLength;

const coverValidator: CustomValidator = (_, { req }) => {
  if(!req.file) {
    throw new Error("Cover is required");
  }

  return true;
};

const createBlogPostSchema: Schema = {
  title: {
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
  },
  content: {
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
  },
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

const updateBlogPostSchema: Schema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title must be string"
    },
    optional: true,
    isLength: {
      errorMessage: `Title can't be larger than ${TITLE_MAX_LENGTH} characters`,
      options: { max: TITLE_MAX_LENGTH }
    }
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content must be string"
    },
    optional: true,
    isLength: {
      errorMessage: `Content can't be larger than ${CONTENT_MAX_LENGTH} characters`,
      options: { max: CONTENT_MAX_LENGTH }
    }
  },
  tags: {
    in: ["body"],
    customSanitizer: {
      options: transformIntoStringArray
    }
  },
};

const checkIfIdExists: CustomValidator = async (id) => {
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

export default {
  createBlogPostSchema,
  updateBlogPostSchema,
  checkIfIdExists
};
