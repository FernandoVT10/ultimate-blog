import sharp from "sharp";
import path from "path";
import fs from "fs";

import { Request } from "express";
import { StorageEngine } from "multer";

type Options = {
  destination: string;
}

type Callback = (error: Error | null) => void;


type HandleFileCb = (error?: Error | null, info?: Partial<Express.Multer.File>) => void;

class ImageStorageEngine implements StorageEngine {
  private destination: string;

  constructor(options: Options) {
    this.destination = options.destination;
  }

  getImageName(fieldName: string): string {
    return `${Date.now()}-${Math.round(Math.random() * 1000)}-${fieldName}.webp`;
  }

  async _handleFile(_: Request, file: Express.Multer.File, cb: HandleFileCb): Promise<void> {
    const imagePath = path.resolve(this.destination, this.getImageName(file.fieldname));

    const writableStream = fs.createWriteStream(imagePath);

    const transformer = sharp().webp();
    file.stream.pipe(transformer).pipe(writableStream);

    writableStream.on("error", cb);

    writableStream.on("finish", () => {
      cb(null, {
        path: imagePath
      });
    });
  }

  _removeFile(_: Request, file: Express.Multer.File, cb: Callback): void {
    fs.unlink(file.path, cb);
  }
}

export default ImageStorageEngine;
