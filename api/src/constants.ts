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

  if(!process.env.STATIC_STORAGE_PATH) {
    console.error("The STATIC_STORAGE_PATH env variable is required");
    process.exit(1);
  }
}

export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT;

// NOTE: this is not how it's supposed to be
export const STATIC_DIR = TESTING
  ? path.resolve(__dirname, "../test/static")
  : path.resolve(process.env.STATIC_STORAGE_PATH as string);

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const APP_STATIC_FILES_URL = process.env.APP_STATIC_FILES_URL as string;
