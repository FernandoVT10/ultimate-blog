import { Schema, model, Types } from "mongoose";

import { MODEL_NAME as BLOG_POST_MODEL_NAME } from "./BlogPost";

export const AUTHOR_NAME_MAX_LENGTH = 30;
export const CONTENT_MAX_LENGTH = 1000;

const MODEL_NAME = "Comment";

export const PARENT_TYPES = [BLOG_POST_MODEL_NAME, MODEL_NAME];

export interface IComment {
  authorName: string;
  content: string;
  parentId: Types.ObjectId;
  parentType: "BlogPost" | "Comment";
  createdAt: number;
  updatedAt: number;
}

const commentSchema = new Schema<IComment>({
  authorName: {
    maxlength: AUTHOR_NAME_MAX_LENGTH,
    type: String,
    required: true
  },
  content: {
    maxlength: CONTENT_MAX_LENGTH,
    type: String,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    refPath: "parentType",
    required: true
  },
  parentType: {
    type: String,
    enum: PARENT_TYPES,
    required: true
  }
}, { timestamps: true });

const Comment = model<IComment>(MODEL_NAME, commentSchema);

export default Comment;
