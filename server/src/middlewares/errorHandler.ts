import { Request, Response, NextFunction } from "express";
import { RequestError } from "../utils/errors";

// eslint-disable-next-line
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if(err instanceof RequestError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  if(err instanceof Error) {
    console.error(err);
  } else {
    // now the err variable can have something unexpected so when want to get as
    // much information as possible using the String constuctor and then passing it
    // to the logger
    console.error(String(err));
  }

  res.status(500).json({
    error: "There was an internal server error trying to complete your request"
  });
};

export default errorHandler;
