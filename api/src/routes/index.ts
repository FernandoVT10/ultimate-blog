import { Router } from "express";

import tagRoutes from "./tags";
import adminRoutes from "./admin";

const router = Router();

router.use("/", tagRoutes, adminRoutes);

export default router;
