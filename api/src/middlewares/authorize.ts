import jwtHelper from "../utils/jwtHelper";
import getAuthTokenFromRequest from "../utils/getAuthTokenFromRequest";

import { RequestHandler } from "express";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { ADMIN_PASSWORD } from "../constants";

type AuthorizeMiddleware = () => RequestHandler;

const authorize: AuthorizeMiddleware = () => async (req, res, next) => {
  const token = getAuthTokenFromRequest(req);

  if(!token) {
    return res.status(401).json({
      errors: [{
        message: "You need to be authenticated"
      }]
    });
  }

  try {
    const data = await jwtHelper.verifyToken(token) as JwtPayload;

    if(data.password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        errors: [{
          message: "Invalid password"
        }]
      });
    }

    next();
  } catch (error) {
    if(error instanceof JsonWebTokenError) {
      return res.status(401).json({
        errors: [{
          message: "Invalid password"
        }]
      });
    }

    next(error);
  }
};

export default authorize;
