import Tag from "@app/models/Tag";

import { faker } from "@faker-js/faker";
import { AuthFactory, TagFactory } from "../../factories";
import {
  checkAuthorizeMiddleware,
  connectDB,
  convertToResponseBody
} from "../../helpers";

import request from "../../request";

connectDB();

describe("integration api/tags", () => {
  describe("GET /api/tags", () => {
    it("should return all tags", async () => {
      const tagA = await TagFactory.createOne();
      const tagB = await TagFactory.createOne();

      const res = await request.get("/api/tags").expect(200);

      expect(res.body).toEqual(convertToResponseBody([
        tagA, tagB
      ]));
    });
  });

  describe("POST /api/tags", () => {
    checkAuthorizeMiddleware("/api/tags", "post");
    
    const callApi = async (name?: any) => {
      const authToken = await AuthFactory.generateAuthToken();
      return request
        .post("/api/tags")
        .set("Cookie", authToken)
        .send({ name });
    };

    it("should create a tag", async () => {
      const name = "music";
      const res = await callApi(name);

      expect(res.statusCode).toBe(204);

      expect(await Tag.exists({ name })).toBeTruthy();
    });

    describe("should fail when", () => {
      it("name is empty", async () => {
        const res = await callApi("");
        expect(res).toContainValidationError({
          field: "name",
          message: "Name is required"
        });
      });

      it("name is not a string", async () => {
        const res = await callApi({ obj: "foo" });
        expect(res).toContainValidationError({
          field: "name",
          message: "Name must be a string"
        });
      });

      it("name is larger than 100 characters", async () => {
        const res = await callApi(faker.random.alpha(101));
        expect(res).toContainValidationError({
          field: "name",
          message: "Name can't be larger than 100 characters"
        });
      });

      it("name already exists", async () => {
        const tag = await TagFactory.createOne();

        const res = await callApi(tag.name);
        expect(res).toContainValidationError({
          field: "name",
          message: `A tag called "${tag.name}" already exists`
        });
      });
    });
  });
});
