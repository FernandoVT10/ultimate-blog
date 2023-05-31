import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose";

export const NAME_MAX_LENGTH = 100;

@modelOptions({
  schemaOptions: { collection: "tags" }
})
export class Tag {
  public _id: Types.ObjectId;

  @prop({
    default: true,
    unique: true,
    maxlength: NAME_MAX_LENGTH,
    type: String
  })
  public name: string;
}

// export interface ITag {
//   name: string;
// }
//
// const tagScheme = new Schema<ITag>({
//   name: {
//     type: String,
//     maxlength: NAME_MAX_LENGTH,
//     unique: true,
//     required: true
//   }
// });

// const Tag = model<ITag>("Tag", tagScheme);

const TagModel = getModelForClass(Tag);
export default TagModel;
