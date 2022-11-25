import { Router } from "express";

import blogPostsRouter from "./blogPosts";

const router = Router();

router.use("/api", blogPostsRouter);

export default router;
