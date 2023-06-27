import path from "path";
import fs from "fs";
import sharp from "sharp";

import {
  STATIC_DIR,
  APP_STATIC_FILES_URL
} from "../constants";

const BLOG_POST_COVERS_URL = path.join(APP_STATIC_FILES_URL, "images/blog/covers/");

export default class BlogPostCover {
  private path = "";
  private name: string;

  public static BASE_PATH = path.join(STATIC_DIR, "/images/blog/covers/");

  // this is the online url that is going to be used in the frontend to fetch the image
  public static getURL(coverName: string): string {
    const url = path.join(BLOG_POST_COVERS_URL, coverName);
    return url.replace(":/", "://");
  }

  constructor(name?: string) {
    this.name = name || "";
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

  async coverExists(): Promise<boolean> {
    return new Promise(resolve => {
      fs.stat(this.getPath(), (err) => {
        if(!err) return resolve(true);
        resolve(false);
      });
    });
  }

  async saveBuffer(buffer: Buffer): Promise<void> {
    await fs.promises.mkdir(BlogPostCover.BASE_PATH, { recursive: true });
    await sharp(buffer).webp().toFile(this.getPath());
  }

  async delete(): Promise<boolean> {
    if(await this.coverExists()) {
      await fs.promises.unlink(this.getPath());
      return true;
    }

    return false;
  }
}
