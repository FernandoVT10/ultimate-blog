import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

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
});

global.afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
