import { NextFunction, Request, Response } from "express";
import { validationResult, ErrorFormatter } from "express-validator";

const errorFormater: ErrorFormatter = (error) => ({
  message: error.msg,
  field: error.type === "field" ? error.path : undefined,
});

const checkValidation = () => (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(errorFormater);

  if(req.requestError) {
    return next(req.requestError);
  }

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array({ onlyFirstError: true }),
    });
  }

  next();
};

export default checkValidation;
