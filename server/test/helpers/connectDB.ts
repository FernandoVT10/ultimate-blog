import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const uri = mongod.getUri();

    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(const collection of collections) {
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });
};

export default connectDB;
