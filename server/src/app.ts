import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import apiRouter from "./api";
import errorHandler from "./middlewares/errorHandler";

import { STATIC_DIR } from "./config/constants";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/static/", express.static(STATIC_DIR));

app.use(apiRouter);

app.use(errorHandler);

export default app;
