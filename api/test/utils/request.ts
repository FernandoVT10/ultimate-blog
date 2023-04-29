import supertest from "supertest";
import app from "@app/app";

export const createRequest = () => supertest(app);
export const createAgent = () => supertest.agent(app);
