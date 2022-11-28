import supertest from "supertest";
import app from "@app/app";

const request = supertest(app);

export default request;
