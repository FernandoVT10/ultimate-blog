import jwtHelper from "../utils/jwtHelper";

import { RequestHandler } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { ADMIN_PASSWORD, AUTH_COOKIE_KEY } from "../config/constants";

type AuthorizeMiddleware = () => RequestHandler;

const authorize: AuthorizeMiddleware = () => async (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE_KEY];

  if(!token) {
    return res.status(401).json({
      message: "You need to be authenticated"
    });
  }

  try {
    const data = await jwtHelper.verifyToken(token) as JwtPayload;

    if(data.password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        message: "Password is incorrect"
      });
    }

    next();
  } catch (error) {
    if(error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: "That trick is not going to work :)"
      });
    }

    next(error);
  }
};

export default authorize;
