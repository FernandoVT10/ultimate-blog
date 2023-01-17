import { Request } from "supertest";
import { faker } from "@faker-js/faker";

interface Options {
  maxLength?: number;
  required?: boolean;
}

const defaultOptions = {
  required: true
};

export const testStringValidation = (
  getRequest: () => Request,
  field: string,
  options: Options = defaultOptions
) => {
  const capitalizeString = (text: string): string => {
    const capital = text.charAt(0).toUpperCase();
    return capital + text.slice(1);
  };

  const getCapitalizedField = (): string => {
    return capitalizeString(field);
  };

  describe(`${field} validation`, () => {
    it(`should fail when the ${field} is not a string`, async () => {
      const notAString = {
        obj: "foo"
      };

      const res = await getRequest().send({
        [field]: notAString
      });

      expect(res.status).toBe(400);
      expect(res).toContainValidationError({
        field,
        message: `${getCapitalizedField()} must be a string`
      });
    });

    if(options.required) {
      it(`should fail when ${field} is empty`, async () => {
        const res = await getRequest().send({
          [field]: ""
        });

        expect(res.status).toBe(400);
        expect(res).toContainValidationError({
          field,
          message: `${getCapitalizedField()} is required`
        });
      });
    }

    if(options.maxLength) {
      const { maxLength } = options;

      it(`should fail when ${field} is larger than ${maxLength} characters`, async () => {
        const res = await getRequest().send({
          [field]: faker.random.alpha(maxLength + 1)
        });

        expect(res.status).toBe(400);
        expect(res).toContainValidationError({
          field,
          message: `${getCapitalizedField()} can't be larger than ${maxLength} characters`
        });
      });
    }
  });
};
