import path from "path";
import fs from "fs";
import sharp from "sharp";

import {
  STATIC_DIR,
  STORAGE_PATHS
} from "../config/constants";

export default class BlogPostCover {
  private path = "";
  private name = "";

  public static BASE_PATH = path.resolve(STATIC_DIR, STORAGE_PATHS.blogposts);

  getName() {
    if(!this.name) {
      this.name = `${Date.now()}-${Math.round(Math.random() * 1000)}-cover.webp`;
    }
    return this.name;
  }

  getPath(): string {
    if(!this.path) {
      this.path = path.resolve(BlogPostCover.BASE_PATH, this.getName());
    }
    return this.path;
  }

  // TODO: I think this method is going to be useful in a future
  // getURL(): string {
  //   const url = path.join(
  //     APP_STATIC_FILES_URL,
  //     STORAGE_PATHS.blogposts,
  //     this.getName()
  //   );
  //   return url.replace(":/", "://");
  // }

  async saveBuffer(buffer: Buffer): Promise<void> {
    await sharp(buffer).webp().toFile(this.getPath());
  }

  async delete(): Promise<boolean> {
    if(this.path) {
      await fs.promises.unlink(this.getPath());
      return true;
    }

    return false;
  }
}
