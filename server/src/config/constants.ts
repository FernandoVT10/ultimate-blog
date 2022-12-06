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

// when testing we want to change the path for an easier testing time
export const STATIC_DIR = TESTING
  ? path.resolve(__dirname, "../../test/static")
  : path.resolve(__dirname, "../../static");

export const BLOG_POST_COVERS_DIR = path.resolve(STATIC_DIR, "images/blog/covers/");

export const APP_STATIC_FILES_URL = process.env.APP_STATIC_FILES_URL as string;

export const STORAGE_PATHS = {
  blogposts: "images/blog/covers/"
};
