import { ADMIN_PASSWORD } from "@app/constants";
import jwtHelper from "@app/utils/jwtHelper";

const generateToken = async (): Promise<string> => {
  const token = await jwtHelper.signToken({
    password: ADMIN_PASSWORD
  });

  return token;
};

export default {
  generateToken
};
