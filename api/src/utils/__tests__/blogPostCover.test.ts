import sharp from "sharp";
import fs from "fs";
import BlogPostCover from "../BlogPostCover";

jest.mock("sharp");

jest.mock("../../constants", () => ({
  STATIC_DIR: "/home/static/",
  APP_STATIC_FILES_URL: "https://example.com/static/"
}));

const statSpy = jest.spyOn(fs, "stat");

describe("utils/BlogPostCover", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getURL", () => {
    it("should get the full cover url", () => {
      expect(
        BlogPostCover.getURL("cover-1.webp")
      ).toBe("https://example.com/static/images/blog/covers/cover-1.webp");
    });
  });

  describe("getName", () => {
    it("should generate a random name", () => {
      const blogPostCover = new BlogPostCover();
      // Easy Regex checks a string that looks like this: 1029384-0394-cover.webp
      expect(blogPostCover.getName()).toMatch(/^(\d+)-(\d+)-cover\.webp$/);
    });

    it("should return the generated name when called twice", () => {
      const blogPostCover = new BlogPostCover();
      const name = blogPostCover.getName();
      expect(blogPostCover.getName()).toBe(name);
    });

    it("should return the setted name", () => {
      const blogPostCover = new BlogPostCover("test-name.webp");
      expect(blogPostCover.getName()).toBe("test-name.webp");
    });
  });

  describe("getPath", () => {
    it("should get the full path of the cover", () => {
      const blogPostCover = new BlogPostCover();
      const name = blogPostCover.getName();

      expect(
        blogPostCover.getPath()
      ).toBe(`/home/static/images/blog/covers/${name}`);
    });

    it("should get the same path when called twice", () => {
      const blogPostCover = new BlogPostCover();
      const path = blogPostCover.getPath();
      expect(blogPostCover.getPath()).toBe(path);
    });
  });

  describe("saveBuffer", () => {
    it("should call sharp", async () => {
      const mkdirSpy = jest.spyOn(fs.promises, "mkdir");
      const mockedSharp = jest.mocked(sharp);

      const mockSharpFunctions = {
        webp: jest.fn().mockReturnThis(),
        toFile: jest.fn().mockResolvedValue(null)
      };

      mkdirSpy.mockResolvedValue("");
      mockedSharp.mockReturnValue(mockSharpFunctions as any);

      const blogPostCover = new BlogPostCover();
      const coverPath = blogPostCover.getPath();
      const buffer = Buffer.from([1, 2]);

      await blogPostCover.saveBuffer(buffer);

      expect(mkdirSpy).toHaveBeenCalled();
      expect(mockedSharp).toHaveBeenCalledWith(buffer);
      expect(mockSharpFunctions.webp).toHaveBeenCalled();
      expect(mockSharpFunctions.toFile).toHaveBeenCalledWith(coverPath);
    });
  });

  describe("delete", () => {
    const unlinkSpy = jest.spyOn(fs.promises, "unlink");

    it("should return true when path exists", () => {
      statSpy.mockImplementation((_, cb: any) => {
        cb(null, {} as any);
      });

      unlinkSpy.mockResolvedValue();

      const blogPostCover = new BlogPostCover("test name");
      expect(blogPostCover.delete()).resolves.toBeTruthy();
    });

    it("should return false when path doesn't exists", () => {
      statSpy.mockImplementation((_, cb: any) => {
        cb(new Error);
      });

      const blogPostCover = new BlogPostCover("test name");
      expect(blogPostCover.delete()).resolves.toBeFalsy();
    });
  });
});
