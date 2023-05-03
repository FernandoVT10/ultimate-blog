import { Request } from "express";

const getAuthTokenFromRequest = (req: Request): string | null => {
  const header = req.get("Authorization") || "";
  const [bearer, token] = header.split(" ");
  return bearer === "Bearer" && token ? token : null;
};

export default getAuthTokenFromRequest;
