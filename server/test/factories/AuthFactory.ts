import { ADMIN_PASSWORD, AUTH_COOKIE_KEY } from "@app/config/constants";
import jwtHelper from "@app/utils/jwtHelper";

const generateAuthToken = async (): Promise<string> => {
  const token = await jwtHelper.signToken({
    password: ADMIN_PASSWORD
  });

  return `${AUTH_COOKIE_KEY}=${token}`;
};

export default {
  generateAuthToken
};
