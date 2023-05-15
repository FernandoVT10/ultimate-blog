import mongoose from "mongoose";
import fs from "fs";

import { MongoMemoryServer } from "mongodb-memory-server";
import { STATIC_DIR } from "@app/constants";

let mongod: MongoMemoryServer;

global.beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);
});

global.beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for(const collection of collections) {
    await collection.deleteMany({});
  }

  // TODO: I think is better to use mock-fs for this job
  // clean all files created in the tests
  try {
    await fs.promises.rm(STATIC_DIR, { recursive: true });
  } catch (error) {
    if((error as NotFoundFileError).code !== "ENOENT") {
      throw error;
    }
  }
});

type NotFoundFileError = {
  code: string;
};

global.afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
