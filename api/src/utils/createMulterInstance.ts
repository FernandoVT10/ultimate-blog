import multer, { memoryStorage } from "multer";

// 20 megabytes represented in bytes
const FILE_SIZE = 20000000;

const createMulterInstance = () => {
  return multer({
    storage: memoryStorage(),
    limits: {
      fileSize: FILE_SIZE
    }
  });
};

export default createMulterInstance;
