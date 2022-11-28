/* eslint-disable @typescript-eslint/no-explicit-any */

import { HydratedDocument } from "mongoose";

/** Converts classes like ObjectIds and Dates into something similar to the result of "res.json". */
const convertToResponseBody = (docs: HydratedDocument<any> | HydratedDocument<any>[]) => {
  const json = JSON.stringify(docs);
  return JSON.parse(json);
};

export default convertToResponseBody;
