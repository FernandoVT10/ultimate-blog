import path from "path";
import { config } from "dotenv";

export const PRODUCTION = process.env.NODE_ENV === "production";
export const TESTING = process.env.NODE_ENV === "test";

if(TESTING) {
  config({
    path: path.resolve(__dirname, "../../.env.test")
  });
} else {
  config();
}

export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT;

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const JWT_EXPIRE_TIME = "30d";

export const AUTH_COOKIE_KEY = "authToken";
