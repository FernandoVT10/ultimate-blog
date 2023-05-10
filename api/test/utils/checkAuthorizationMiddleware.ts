import { createRequest } from "./request";

type Method = "post" | "get" | "delete" | "put";

const request = createRequest();

const checkAuthorizeMiddleware = (url: string, method: Method) => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request[method](url).expect(401);

    expect(res.status).toBe(401);
  });
};

export default checkAuthorizeMiddleware;
