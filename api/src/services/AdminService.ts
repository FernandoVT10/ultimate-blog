import { ADMIN_PASSWORD } from "../constants";
import { CustomValidator } from "express-validator";
import { JwtPayload } from "jsonwebtoken";

import jwtHelper from "../utils/jwtHelper";

const checkPassword: CustomValidator = (password) => {
  if(password !== ADMIN_PASSWORD) {
    throw new Error("Password is incorrect");
  }

  return true;
};

const getAuthToken = (password: string) => jwtHelper.signToken({ password });

const isLogged = async (authToken: string | null): Promise<boolean> => {
  if(!authToken) return false;

  try {
    const data = await jwtHelper.verifyToken(authToken) as JwtPayload;

    return data.password === ADMIN_PASSWORD;
  } catch {
    return false;
  }
};

export default {
  getAuthToken,
  checkPassword,
  isLogged
};
