import ImageStorageEngine from "@app/lib/ImageStorageEngine";

describe("utils/ImageStoreEngine", () => {
  const destination = "/dev/null";

  describe("getImageName", () => {
    it("should return an image name", () => {
      const store = new ImageStorageEngine({ destination });

      jest.spyOn(Date, "now").mockReturnValueOnce(123);
      jest.spyOn(Math, "round").mockReturnValueOnce(5);

      expect(store.getImageName("test")).toBe("123-5-test.webp");
    });
  });

  describe("_handleFile", () => {
    it.todo("Make tests for this...");
  });
});
