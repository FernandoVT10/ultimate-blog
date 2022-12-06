import imageFilter from "@app/utils/imageFilter";

import { RequestError } from "@app/utils/errors";

describe("imageFilter", () => {
  const req: any = {};
  const callback = jest.fn();

  beforeEach(() => callback.mockClear());

  it("should accept the file", () => {
    const file = {
      mimetype: "image/png"
    } as Express.Multer.File;

    imageFilter(req, file, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  describe("should call the callback with a RequestError", () => {
    it("it's not an image", () => {
      const file = {
        mimetype: "text/html"
      } as Express.Multer.File;

      imageFilter(req, file, callback);

      expect(callback).toHaveBeenCalledWith(
        new RequestError(400, "Files must be .png, .jpeg, .jpg or .webp")
      );
    });

    it("the image type is not accepted", () => {
      const file = {
        mimetype: "image/gif"
      } as Express.Multer.File;

      imageFilter(req, file, callback);

      expect(callback).toHaveBeenCalledWith(
        new RequestError(400, "Files must be .png, .jpeg, .jpg or .webp")
      );
    });
  });
});
