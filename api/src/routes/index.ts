import { Router } from "express";

import tagRoutes from "./tags";
import adminRoutes from "./admin";
import blogPostsRoutes from "./blogposts";

const router = Router();

router.use("/", tagRoutes, adminRoutes, blogPostsRoutes);

export default router;
