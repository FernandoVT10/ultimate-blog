import BlogPostController from "../controllers/BlogPostController";
import asyncHandler from "express-async-handler";
import checkValidation from "@app/middlewares/checkValidation";

import { query, param } from "express-validator";
import { Router } from "express";
import { transformIntoStringArray } from "../utils/sanitizers";
import { isValidObjectId } from "mongoose";

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

router.get(
  "/blogposts/:blogPostId",

  param("blogPostId").custom(value => {
    if(isValidObjectId(value)) return true;

    throw new Error("Id is invalid");
  }),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const blogPostId = req.params?.blogPostId;

    const blogPost = await BlogPostController.getById(blogPostId);

    res.json(blogPost);
  })
);

export default router;
