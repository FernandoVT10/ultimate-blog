import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_EXPIRE_TIME, JWT_SECRET_KEY } from "../config/constants";

const verifyToken = (token: string): Promise<string | JwtPayload | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
};

const signToken = (data: JwtPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXPIRE_TIME },
      (err, token) => {
        if(err || !token) return reject(err);
        resolve(token);
      }
    );
  });
};

export default {
  verifyToken, signToken
};
