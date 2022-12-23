import { Router } from "express";

import blogPostsRouter from "./blogposts";
import adminRouter from "./admin";
import tagsRouter from "./tags";

const router = Router();

router.use("/api", blogPostsRouter, adminRouter, tagsRouter);

export default router;
