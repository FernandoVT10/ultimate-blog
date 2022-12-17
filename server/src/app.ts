import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiRouter from "./api";
import errorHandler from "./middlewares/errorHandler";

import { STATIC_DIR, PRODUCTION } from "./config/constants";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

if(!PRODUCTION) {
  // cors is not gonna be needed on production, because ngnix will be used
  // to run both backend and frontend in the same domain
  app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
  }));
}

app.use("/static/", express.static(STATIC_DIR));

app.use(apiRouter);

app.use(errorHandler);

export default app;
