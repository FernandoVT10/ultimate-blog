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

export default {
  login, validatePassword
};
