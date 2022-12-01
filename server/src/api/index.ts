import { Router } from "express";

import blogPostsRouter from "./blogposts";
import adminRouter from "./admin";

const router = Router();

router.use("/api", blogPostsRouter, adminRouter);

export default router;
