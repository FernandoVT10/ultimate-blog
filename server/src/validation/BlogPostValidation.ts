import modelsConfig from "../config/models";

import { CustomValidator, Schema } from "express-validator";
import { transformIntoStringArray } from "../utils/sanitizers";

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

export default {
  createBlogPostSchema
};
