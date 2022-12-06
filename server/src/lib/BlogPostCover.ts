import path from "path";
import fs from "fs";
import sharp from "sharp";

import {
  STATIC_DIR,
  STORAGE_PATHS,
  APP_STATIC_FILES_URL
} from "../config/constants";

export default class BlogPostCover {
  private path = "";
  private name = "";

  public static BASE_PATH = path.resolve(STATIC_DIR, STORAGE_PATHS.blogposts);

  static getURL(coverName: string): string {
    const url = path.join(
      APP_STATIC_FILES_URL,
      STORAGE_PATHS.blogposts,
      coverName
    );
    return url.replace(":/", "://");
  }

  constructor(name?: string) {
    if(name) {
      this.name = name;
    }
  }

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
