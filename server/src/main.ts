import mongoose from "mongoose";
import app from "./app";

import { MONGO_URI, PORT } from "./config/constants";

(async () => {
  console.log("Connecting to the db...");
  await mongoose.connect(MONGO_URI);

  const port = PORT || 3000;

  app.listen(port, () => console.log(`Server running on https://localhost:${port}`));
})();
