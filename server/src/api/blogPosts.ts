import { Router } from "express";

const router = Router();

router.get("/blogPosts/", (_, res) => {
  res.json([]);
});

export default router;
