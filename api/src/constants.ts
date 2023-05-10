import path from "path";
import { config } from "dotenv";

export const PRODUCTION = process.env.NODE_ENV === "production";
export const TESTING = process.env.NODE_ENV === "test";

if(TESTING) {
  config({
    path: path.resolve(__dirname, "../.env.test")
  });
} else {
  config();
}

export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT;

// NOTE: this is not how it's supposed to be
export const STATIC_DIR = TESTING
  ? path.resolve(__dirname, "../test/static")
  : path.resolve(__dirname, "../static");

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const APP_STATIC_FILES_URL = process.env.APP_STATIC_FILES_URL as string;
