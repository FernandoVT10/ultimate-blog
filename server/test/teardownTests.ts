import fs from "fs";

import { STATIC_DIR } from "@app/config/constants";

afterAll(async () => {
  // remove all files that could've been created
  await fs.promises.rm(STATIC_DIR, {
    recursive: true, force: true
  });
});
