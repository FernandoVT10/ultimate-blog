import { JwtPayload } from "jsonwebtoken";

import { ADMIN_PASSWORD } from "../config/constants";
import { CustomValidator } from "express-validator";

import jwtHelper from "..//utils/jwtHelper";

const login = (password: string): Promise<string> => {
  return jwtHelper.signToken({ password });
};

const validatePassword: CustomValidator = (password) => {
  if(password !== ADMIN_PASSWORD) {
    throw new Error("Password is incorrect");
  }

  return true;
};

interface CheckStatusReturnData {
  isLogged: boolean;
}

const checkStatus = async (authToken: string): Promise<CheckStatusReturnData> => {
  let isLogged = true;

  if(!authToken) {
    isLogged = false;
  }

  try {
    const data = await jwtHelper.verifyToken(authToken) as JwtPayload;

    if(data.password !== ADMIN_PASSWORD) {
      isLogged = false;
    }
  } catch {
    isLogged = false;
  }

  return { isLogged };
};

export default {
  login, validatePassword, checkStatus
};
