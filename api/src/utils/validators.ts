import { body, CustomValidator, ValidationChain } from "express-validator";
import { isValidObjectId } from "mongoose";

const stringValidator = (field: string, maxLength: number): ValidationChain => {
  return body(field)
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`${field} is required`)
    .isString()
    .withMessage(`${field} must be a string`)
    .isLength({ max: maxLength })
    .withMessage(`${field} can'be larger than ${maxLength} characters`);
};

const validateId: CustomValidator = (value) => {
  if(isValidObjectId(value)) return true;

  throw new Error("Id is invalid");
};

export default { stringValidator, validateId };
