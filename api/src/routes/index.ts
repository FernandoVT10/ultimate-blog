import { Router } from "express";

import tagRoutes from "./tags";
import adminRoutes from "./admin";
import blogPostsRoutes from "./blogposts";
import commentsRoutes from "./comments";

const router = Router();

router.use("/", tagRoutes, adminRoutes, blogPostsRoutes, commentsRoutes);

export default router;
