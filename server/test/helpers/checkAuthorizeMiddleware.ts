import request from "../request";

type Method = "post" | "get" | "delete" | "put";

const checkAuthorizeMiddleware = (url: string, method: Method) => {
  it("should pass if authorize middleware is added", async () => {
    const res = await request[method](url).expect(401);

    expect(res.body.message).toBe("You need to be authenticated");
  });
};

export default checkAuthorizeMiddleware;
