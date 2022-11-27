import { Schema, model } from "mongoose";

export interface ITag {
  name: string
}

const tagScheme = new Schema<ITag>({
  name: {
    type: String,
    required: true
  }
});

const Tag = model<ITag>("Tag", tagScheme);

export default Tag;
