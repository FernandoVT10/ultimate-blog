import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./api";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(apiRouter);

export default app;
