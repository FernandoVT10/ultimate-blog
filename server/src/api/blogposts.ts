import BlogPostController from "../controllers/BlogPostController";
import BlogPostValidation from "../validation/BlogPostValidation";
import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";
import authorize from "../middlewares/authorize";
import createMulterInstance from "../config/multer";

import { query, param, checkSchema } from "express-validator";
import { Router } from "express";
import { transformIntoStringArray } from "../utils/sanitizers";
import { isValidObjectId } from "mongoose";
import { BLOG_POST_COVERS_DIR } from "../config/constants";

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

  // TODO: replace it for BlogPostValidation.checkIfIdExists
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

const upload = createMulterInstance(BLOG_POST_COVERS_DIR);

router.post(
  "/blogposts",

  authorize(),

  upload.single("cover"),

  checkSchema(BlogPostValidation.createBlogPostSchema),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;
    const imageFile = req.file as Express.Multer.File;

    const createdPost = await BlogPostController.createOne({
      title, content, tags, imageFile
    });

    res.json(createdPost);
  })
);

router.put(
  "/blogposts/:blogPostId",

  authorize(),

  upload.single("cover"),

  param("blogPostId")
    .custom(BlogPostValidation.checkIfIdExists),

  checkSchema(BlogPostValidation.updateBlogPostSchema),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const { title, content, tags } = req.body;
    const imageFile = req.file;

    const updatedBlogPost = await BlogPostController.updateOne(
      blogPostId,
      {
        title,
        content,
        tags,
        imageFile
      }
    );

    res.json(updatedBlogPost);
  })
);

export default router;
