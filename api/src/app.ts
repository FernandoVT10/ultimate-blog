import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import errorHandler from "./middlewares/errorHandler";

import { PRODUCTION } from "./constants";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

if(!PRODUCTION) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use("/api", routes);

app.use(errorHandler);

export default app;
