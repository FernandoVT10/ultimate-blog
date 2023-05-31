import { Types } from "mongoose";
import {
  prop,
  modelOptions,
  getModelForClass,
  Ref
} from "@typegoose/typegoose";

// const MODEL_NAME = "Comment";
export const AUTHOR_NAME_MAX_LENGTH = 30;
export const CONTENT_MAX_LENGTH = 1000;

export const PARENT_MODELS = ["Comment", "BlogPost"];

@modelOptions({
  schemaOptions: {
    collection: "comments",
    timestamps: true
  }
})
export class Comment {
  public readonly _id: Types.ObjectId;

  @prop({
    required: true,
    type: String,
    maxlength: AUTHOR_NAME_MAX_LENGTH
  })
  public authorName: string;

  @prop({
    required: true,
    type: String,
    maxlength: CONTENT_MAX_LENGTH
  })
  public content: string;

  @prop({ required: true, refPath: "parentModel", type: Types.ObjectId })
  public parentId: Types.ObjectId;

  @prop({ required: true, type: String, enum: PARENT_MODELS })
  public parentModel: "BlogPost" | "Comment";

  @prop({ type: Number, default: 0 })
  public level: number;

  @prop({ ref: () => Comment })
  public comments?: Ref<Comment>[];

  public createdAt: Date;
  public updatedAt: Date;
}

// export interface IComment {
//   authorName: string;
//   content: string;
//   parentId: Types.ObjectId;
//   parentModel: "BlogPost" | "Comment";
//   level: number;
//   createdAt: number;
//   updatedAt: number;
// }
//
// const commentSchema = new Schema<IComment>({
//   authorName: {
//     maxlength: AUTHOR_NAME_MAX_LENGTH,
//     type: String,
//     required: true
//   },
//   content: {
//     maxlength: CONTENT_MAX_LENGTH,
//     type: String,
//     required: true
//   },
//   parentId: {
//     type: Schema.Types.ObjectId,
//     refPath: "parentModel",
//     required: true
//   },
//   parentModel: {
//     type: String,
//     enum: PARENT_MODELS,
//     required: true
//   },
//   level: {
//     type: Number,
//     default: 0
//   }
// }, { timestamps: true });

// const Comment = model<IComment>(MODEL_NAME, commentSchema);

const CommentModel = getModelForClass(Comment);

export default CommentModel;
