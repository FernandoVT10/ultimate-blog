import { CustomValidator } from "express-validator";
import { isValidObjectId } from "mongoose";

const isIdValid: CustomValidator = (value) => {
  return isValidObjectId(value);
};

export default {
  isIdValid
};
