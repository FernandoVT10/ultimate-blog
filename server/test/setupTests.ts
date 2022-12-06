/* eslint-disable @typescript-eslint/no-explicit-any */
const getErrorsFromResponse = (response: any) => {
  if(!response) {
    throw new Error("The response can't be null");
  }
  else if(!response.body) {
    throw new Error("The response doesn't have a body");
  }
  else if(!response.body.errors || !response.body.errors.length) {
    throw new Error("Body doesn't contain any errors");
  }

  return response.body.errors;
};

expect.extend({
  toContainValidationError(response, expected) {
    const errors = getErrorsFromResponse(response);

    // eslint-disable-next-line
    const matchedError = errors.find((error: any) => {
      return this.equals(error, expected);
    });

    const pass = matchedError ? true : false;

    if(pass) {
      return {
        message: () => `
          ${this.utils.printExpected(expected)}\n
          exists within\n
          ${this.utils.printReceived(errors)}
        `,
        pass
      };
    }

    return {
      message: () => `
        ${this.utils.printExpected(expected)}\n
        doesn't exist within\n
        ${this.utils.printReceived(errors)}
      `,
      pass
    };
  },
  toContainValidationErrors(response, expectedErrors) {
    const errors = getErrorsFromResponse(response);

    let expectedError: any;
    let pass: boolean;

    if(this.isNot) {
      // if not is setted, we want to know if there is an error that match
      expectedError = expectedErrors.find((expectedError: any) => {
        return errors.find((error: any) => {
          return this.equals(error, expectedError);
        });
      });

      // if there's a matched error we need to set pass to true,
      // because "expect.not" expects "false" as a success
      // this is really weird, but it's how jest works
      pass = expectedError ? true : false;
    } else {
      // otherwise , we want to know if there is an error that doesn't match
      expectedError = expectedErrors.find((expectedError: any) => {
        return !errors.find((error: any) => {
          return this.equals(error, expectedError);
        });
      });

      // here expects "true" as success, so if expectedError is undefined
      // it means that there's no errors that haven't matched
      pass = !expectedError;
    }

    if(pass) {
      return {
        message: () => `
          ${this.utils.printExpected(expectedError)}\n
          exists within\n
          ${this.utils.printReceived(errors)}
        `,
        pass
      };
    }

    return {
      message: () => `
        ${this.utils.printExpected(expectedError)}\n
        doesn't exist within\n
        ${this.utils.printReceived(errors)}
      `,
      pass
    };
  }
});
