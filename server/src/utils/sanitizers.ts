import { CustomSanitizer } from "express-validator";

export const transformIntoStringArray: CustomSanitizer = (value) => {
  if(value) {
    if(Array.isArray(value)) {
      return value.map(val => String(val));
    }

    return [String(value)];
  }

  return null;
};
