import { Router } from "express";

import blogPostsRouter from "./blogposts";
import adminRouter from "./admin";
import tagsRouter from "./tags";
import commentsRouter from "./comments";

const router = Router();

router.use("/api", blogPostsRouter, adminRouter, tagsRouter, commentsRouter);

export default router;
