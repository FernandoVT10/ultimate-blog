import fs from "fs";

const checkIfFileExists = async (filePath: string): Promise<boolean> => {
  return new Promise(resolve => {
    fs.stat(filePath, (err) => {
      if(!err) return resolve(true);
      resolve(false);
    });
  });
};

export default checkIfFileExists;
