import multer from "multer";
import ImageStorageEngine from "../lib/ImageStorageEngine";
import imageFilter from "../utils/imageFilter";

// 20 megabytes represented in bytes
const FILE_SIZE = 20000000;

const createMulterInstance = (destination: string) => {
  const storage = new ImageStorageEngine({ destination });

  return multer({
    storage,
    limits: {
      fileSize: FILE_SIZE
    },
    fileFilter: imageFilter
  });
};

export default createMulterInstance;
