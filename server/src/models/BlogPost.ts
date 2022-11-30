import { Schema, model, Types, HydratedDocument } from "mongoose";
import { ITag } from "./Tag";

import modelsConf from "../config/models";

export interface IBlogPost {
  title: string;
  content: string;
  cover: string;
  tags: HydratedDocument<ITag>[];
  createdAt: number;
  updatedAt: number;
}

const { blogPost: blogPostConf } = modelsConf;

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      maxlength: blogPostConf.title.maxLength,
      required: true
    },
    content: {
      type: String,
      maxlength: blogPostConf.content.maxLength,
      required: true
    },
    cover: {
      type: String,
      required: true
    },
    tags: [{
      type: Types.ObjectId,
      ref: "Tag"
    }]
  },
  { timestamps: true }
);


const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);

export default BlogPost;
