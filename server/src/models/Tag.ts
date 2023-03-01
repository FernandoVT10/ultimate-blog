import { Schema, model } from "mongoose";

export const NAME_MAX_LENGTH = 100;

export interface ITag {
  name: string;
}

const tagScheme = new Schema<ITag>({
  name: {
    type: String,
    maxlength: NAME_MAX_LENGTH,
    unique: true,
    required: true
  }
});

const Tag = model<ITag>("Tag", tagScheme);

export default Tag;
