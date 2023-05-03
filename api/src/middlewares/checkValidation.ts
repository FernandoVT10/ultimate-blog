import { NextFunction, Request, Response } from "express";
import { validationResult, ValidationError } from "express-validator";

const errorFormater = ({ msg, param }: ValidationError) => ({
  message: msg,
  field: param,
});

const checkValidation = () => (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(errorFormater);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array({ onlyFirstError: true }),
    });
  }

  next();
};

export default checkValidation;
