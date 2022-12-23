import { Schema, model } from "mongoose";

import modelConfig from "../config/models";

export interface ITag {
  name: string;
}

const tagScheme = new Schema<ITag>({
  name: {
    type: String,
    maxlength: modelConfig.tag.name.maxLength,
    unique: true,
    required: true
  }
});

const Tag = model<ITag>("Tag", tagScheme);

export default Tag;
