import { ADMIN_PASSWORD } from "../constants";
import { CustomValidator } from "express-validator";

import jwtHelper from "../utils/jwtHelper";

const checkPassword: CustomValidator = (password) => {
  if(password !== ADMIN_PASSWORD) {
    throw new Error("Password is incorrect");
  }

  return true;
};

const getAuthToken = (password: string) => jwtHelper.signToken({ password });

export default {
  getAuthToken,
  checkPassword
};
