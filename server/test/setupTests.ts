expect.extend({
  toContainValidationError(response, expected) {
    if(!response) {
      throw new Error("The response can't be null");
    }
    else if(!response.body) {
      throw new Error("The response doesn't have a body");
    }
    else if(!response.body.errors) {
      throw new Error("Body doesn't contain any errors");
    }

    const { errors } = response.body;


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
  }
});
