import { mongooseLeanGetters } from "mongoose-lean-getters";
import BlogPostCover from "../utils/BlogPostCover";

import {
  prop,
  modelOptions,
  getModelForClass,
  plugin,
  Ref,
} from "@typegoose/typegoose";

import { Tag } from "./Tag";
import { Types } from "mongoose";

export const MODEL_NAME = "BlogPost";
export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 5000;

@modelOptions({
  schemaOptions: {
    collection: "blogposts",
    timestamps: true,
    toJSON: { getters: true }
    // does this do something?
    // id: false
  }
})
@plugin(mongooseLeanGetters)
export class BlogPost {
  public readonly _id: Types.ObjectId;

  @prop({
    required: true,
    maxlength: TITLE_MAX_LENGTH,
    type: String
  })
  public title: string;

  @prop({
    required: true,
    maxlength: CONTENT_MAX_LENGTH,
    type: String
  })
  public content: string;

  @prop({
    type: String,
    get: (cover: typeof String): string => BlogPostCover.getURL(cover.toString()),
    required: true
  })
  public cover: string;

  @prop({ ref: () => Tag })
  public tags: Ref<Tag>[];

  public createdAt: Date;
  public updatedAt: Date;
}

// export interface IBlogPost {
//   title: string;
//   content: string;
//   cover: string;
//   tags: HydratedDocument<ITag>[];
//   createdAt: number;
//   updatedAt: number;
// }
//
// const blogPostSchema = new Schema<IBlogPost>(
//   {
//     title: {
//       type: String,
//       maxlength: TITLE_MAX_LENGTH,
//       required: true
//     },
//     content: {
//       type: String,
//       maxlength: CONTENT_MAX_LENGTH,
//       required: true
//     },
//     cover: {
//       type: String,
//       get: (cover: typeof String): string => BlogPostCover.getURL(cover.toString()),
//       required: true
//     },
//     tags: [{
//       type: Types.ObjectId,
//       ref: "Tag"
//     }]
//   },
//   {
//     timestamps: true,
//     toJSON: { getters: true },
//     id: false
//   }
// );

// blogPostSchema.plugin(mongooseLeanGetters);

// const BlogPost = model<IBlogPost>(MODEL_NAME, blogPostSchema);

const BlogPostModel = getModelForClass(BlogPost);

export default BlogPostModel;
