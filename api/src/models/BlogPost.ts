import { Schema, model, Types, HydratedDocument } from "mongoose";
import { mongooseLeanGetters } from "mongoose-lean-getters";
import BlogPostCover from "../utils/BlogPostCover";
import { ITag } from "./Tag";

export const MODEL_NAME = "BlogPost";
export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 5000;

export interface IBlogPost {
  title: string;
  content: string;
  cover: string;
  tags: HydratedDocument<ITag>[];
  createdAt: number;
  updatedAt: number;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      maxlength: TITLE_MAX_LENGTH,
      required: true
    },
    content: {
      type: String,
      maxlength: CONTENT_MAX_LENGTH,
      required: true
    },
    cover: {
      type: String,
      get: (cover: typeof String): string => BlogPostCover.getURL(cover.toString()),
      required: true
    },
    tags: [{
      type: Types.ObjectId,
      ref: "Tag"
    }]
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    id: false
  }
);

blogPostSchema.plugin(mongooseLeanGetters);

const BlogPost = model<IBlogPost>(MODEL_NAME, blogPostSchema);

export default BlogPost;
