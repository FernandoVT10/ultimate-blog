import path from "path";

import pathTransformers from "@app/utils/pathTransformers";
import { STATIC_DIR } from "@app/config/constants";

jest.mock("@app/config/constants", () => ({
  APP_STATIC_FILES_URL: "https://localhost:3000/static",
  STATIC_DIR: "/home/test/static"
}));

describe("utils/pathTransformers", () => {
  describe("transformPathToURL", () => {
    const { transformPathToURL } = pathTransformers;

    it("should return a correct url", () => {
      const filePath = path.resolve(STATIC_DIR, "./test/path/test.webp");

      expect(transformPathToURL(filePath)).toBe(
        "https://localhost:3000/static/test/path/test.webp"
      );
    });
  });

  describe("transformURLToPath", () => {
    const { transformURLToPath } = pathTransformers;

    it("should return the correct path", () => {
      expect(
        transformURLToPath("https://localhost:3000/static/test/path/test.webp")
      ).toBe("/home/test/static/test/path/test.webp");
    });
  });
});
