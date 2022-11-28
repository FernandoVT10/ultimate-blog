import { Router } from "express";

import blogPostsRouter from "./blogposts";

const router = Router();

router.use("/api", blogPostsRouter);

export default router;
