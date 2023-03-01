import BlogPostService from "../services/BlogPostService";
import CommentService from "../services/CommentService";

import { ParamSchema } from "express-validator";
import { isValidObjectId, Error as MongooseError } from "mongoose";

import {
  AUTHOR_NAME_MAX_LENGTH,
  CONTENT_MAX_LENGTH,
  REPLIED_TO_MODEL_NAMES,
  IComment
} from "../models/Comment";

const authorName: ParamSchema = {
  in: ["body"],
  exists: {
    errorMessage: "AuthorName is required",
    options: {
      checkNull: true,
      checkFalsy: true
    }
  },
  isString: {
    errorMessage: "AuthorName must be a string"
  },
  isLength: {
    errorMessage: `AuthorName can't be larger than ${AUTHOR_NAME_MAX_LENGTH} characters`,
    options: { max: AUTHOR_NAME_MAX_LENGTH }
  }
};

const content: ParamSchema = {
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

const repliedToModel: ParamSchema = {
  in: ["body"],
  isIn: {
    errorMessage: "repliedToModel is invalid",
    options: REPLIED_TO_MODEL_NAMES
  }
};

const repliedTo: ParamSchema = {
  in: ["body"],
  custom: {
    options: async (value, { req }) => {
      if(!isValidObjectId(value)) throw new Error("repliedTo is invalid");

      const repliedToModel: IComment["repliedToModel"] = req.body.repliedToModel;

      try {
        if(repliedToModel === "BlogPost" && !await BlogPostService.checkIfExists(value)) {
          throw new Error("BlogPost not found");
        }

        if(repliedToModel === "Comment" && !await CommentService.checkIfExists(value)) {
          throw new Error("Comment not found");
        } 
      } catch (err) {
        if(err instanceof MongooseError) {
          // TODO: log the error
          console.error(err);
          return false;
        }

        throw err;
      }

      return true;
    }
  }
};

const commentId: ParamSchema = {
  in: ["params"],
  custom: {
    options: async (value) => {
      if(!isValidObjectId(value)) throw new Error("commentId is invalid");

      try {
        if(!await CommentService.checkIfExists(value)) {
          throw new Error("Comment not found");
        }
      } catch (err) {
        if(err instanceof MongooseError) {
          // TODO: log the error
          console.error(err);
          return false;
        }

        throw err;
      }

      return true;
    }
  }
};

export default {
  authorName,
  content,
  repliedToModel,
  repliedTo,
  commentId
};
