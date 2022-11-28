import BlogPostController from "../controllers/BlogPostController";
import asyncHandler from "express-async-handler";

import { query } from "express-validator";
import { Router } from "express";
import { transformIntoStringArray } from "../utils/sanitizers";

const router = Router();

router.get(
  "/blogposts/",

  query("tags").customSanitizer(transformIntoStringArray),

  asyncHandler(async (req, res) => {
    const blogPosts = await BlogPostController.getAll({
      tags: req.query?.tags
    });

    res.json(blogPosts);
  })
);

export default router;
