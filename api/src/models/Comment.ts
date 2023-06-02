import { Types } from "mongoose";
import {
  prop,
  post,
  modelOptions,
  getModelForClass,
  Ref
} from "@typegoose/typegoose";

export const AUTHOR_NAME_MAX_LENGTH = 30;
export const CONTENT_MAX_LENGTH = 1000;

export const PARENT_MODELS = ["Comment", "BlogPost"];

@modelOptions({
  schemaOptions: {
    collection: "comments",
    timestamps: true
  }
})
@post<Comment>("findOneAndDelete", async function(comment) {
  await this.model.deleteMany({
    parentId: comment._id,
    parentModel: "Comment"
  });
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

const CommentModel = getModelForClass(Comment);

export default CommentModel;
