import { body, ValidationChain } from "express-validator";

const stringValidator = (field: string, maxLength: number): ValidationChain => {
  return body(field)
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`${field} is required`)
    .isString()
    .withMessage(`${field} must be a string`)
    .isLength({ max: maxLength })
    .withMessage(`${field} can'be larger than ${maxLength} characters`);
};

export default { stringValidator };
