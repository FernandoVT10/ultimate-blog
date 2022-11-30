import { Response } from "express";

const mockExpress = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  } as unknown as Response;

  const req = {};

  const next = jest.fn();

  return { res, req, next };
};

export default mockExpress;
