import { Response } from "express";

const mockExpress = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  } as unknown as Response;

  // eslint-disable-next-line
  const req = {} as any;

  const next = jest.fn();

  return { res, req, next };
};

export default mockExpress;
