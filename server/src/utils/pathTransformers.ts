import path from "path";
import { STATIC_DIR, APP_STATIC_FILES_URL } from "../config/constants";

/**
 * This function takes an absolute path (e.g /home/user/static/images/filename.webp) and transforms it into
 * a url removing everything behind the static folder (e.g https://localhost/static/images/filename.webp)
 * Note: The path after the static folder will be used.
*/
const transformPathToURL = (pathString: string): string => {
  const relativePath = pathString.replace(STATIC_DIR, "");
  // we normilize the path because can appear two "/" together in the middle of the path
  const url = path.normalize(APP_STATIC_FILES_URL + relativePath);
  // now we add a slash because urls have 2 "/" after of the "http"
  return url.replace(":/", "://");
};

export default {
  transformPathToURL
};
