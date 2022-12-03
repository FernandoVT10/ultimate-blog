import { Request } from "express";
import { FileFilterCallback } from "multer";
import { RequestError } from "./errors";

const ACCEPTED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const imageFilter = (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if(ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new RequestError(400, "Files must be .png, .jpeg, .png or .webp"));
};

export default imageFilter;
