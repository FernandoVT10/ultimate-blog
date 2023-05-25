import { Schema, model, Types } from "mongoose";

const MODEL_NAME = "Comment";
export const AUTHOR_NAME_MAX_LENGTH = 30;
export const CONTENT_MAX_LENGTH = 1000;

export const PARENT_MODELS = ["Comment", "BlogPost"];

export interface IComment {
  authorName: string;
  content: string;
  parentId: Types.ObjectId;
  parentModel: "BlogPost" | "Comment";
  level: number;
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
    refPath: "parentModel",
    required: true
  },
  parentModel: {
    type: String,
    enum: PARENT_MODELS,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Comment = model<IComment>(MODEL_NAME, commentSchema);

export default Comment;
