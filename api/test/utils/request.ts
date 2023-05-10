import supertest from "supertest";
import app from "@app/app";
import { AuthFactory } from "../factories";

export const createRequest = () => supertest(app);
export const createAgent = () => supertest.agent(app);

export const createAuthorizedAgent = async () => {
  const authToken = await AuthFactory.generateToken();

  const agent = createAgent();
  agent.set("Authorization", `Bearer ${authToken}`);

  return agent;
};
