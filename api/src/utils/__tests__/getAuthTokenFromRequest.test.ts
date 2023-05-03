import httpMocks from "node-mocks-http";
import getAuthTokenFromRequest from "../getAuthTokenFromRequest";

describe("utils/getAuthTokenFromRequest", () => {
  it("should return the token", () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer token"
      }
    });

    expect(
      getAuthTokenFromRequest(req)
    ).toBe("token");
  });

  it("should return null when no authorization header", () => {
    const req = httpMocks.createRequest();

    expect(
      getAuthTokenFromRequest(req)
    ).toBeNull();
  });

  it("should return null when no token", () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer "
      }
    });

    expect(
      getAuthTokenFromRequest(req)
    ).toBeNull();
  });

  it("should return null when doesn't start with Bearer", () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: "B3ar3r token"
      }
    });

    expect(
      getAuthTokenFromRequest(req)
    ).toBeNull();
  });
});
