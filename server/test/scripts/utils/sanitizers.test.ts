import { transformIntoStringArray } from "@app/utils/sanitizers";

const meta = {} as any;

describe("utils/sanitizers", () => {
  describe("transformIntoStringArray", () => {
    it("should return null", () => {
      expect(
        transformIntoStringArray(null, meta)
      ).toBe(null);
    });

    it("should transform strings", () => {
      expect(
        transformIntoStringArray("abc", meta)
      ).toEqual(["abc"]);
    });

    it("should transform numbers", () => {
      expect(
        transformIntoStringArray(123, meta)
      ).toEqual(["123"]);
    });

    it("should transform objects", () => {
      const obj = { foo: "bar" };

      expect(
        transformIntoStringArray(obj, meta)
      ).toEqual([String(obj)]);
    });

    it("should transform array of objects", () => {
      const obj1 = { foo: "bar" };
      const obj2 = { foo: "bar" };
      const obj3 = { foo: "bar" };

      expect(
        transformIntoStringArray([obj1, obj2, obj3], meta)
      ).toEqual([
        String(obj1),
        String(obj2),
        String(obj3)
      ]);
    });

    it("should transform array of objects, numbers and strings", () => {
      const arr = [
        "abc",
        123,
        { obj: "foo" }
      ];

      expect(
        transformIntoStringArray(arr, meta)
      ).toEqual([
        "abc",
        "123",
        String(arr[2])
      ]);
    });

    it("should return array strings intact", () => {
      const arr = [
        "abc",
        "foo",
        "bar"
      ];

      expect(
        transformIntoStringArray(arr, meta)
      ).toEqual(arr);
    });
  });
});
