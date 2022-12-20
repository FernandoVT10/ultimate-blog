import BlogPostController from "../controllers/BlogPostController";
import BlogPostValidation from "../validation/BlogPostValidation";
import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";
import authorize from "../middlewares/authorize";
import createMulterInstance from "../config/multer";

import { query, body, param, checkSchema } from "express-validator";
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

const upload = createMulterInstance();

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
  "/blogposts/:blogPostId/updateTitle",

  authorize(),

  checkSchema(
    BlogPostValidation.updateBlogPostTitleSchema
  ),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const { title } = req.body;

    await BlogPostController.updateTitle(blogPostId, title);

    res.sendStatus(204);
  })
);


router.put(
  "/blogposts/:blogPostId/updateContent",

  authorize(),

  checkSchema(
    BlogPostValidation.updateBlogPostContentSchema
  ),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const { content } = req.body;

    await BlogPostController.updateContent(blogPostId, content);

    res.sendStatus(204);
  })
);

router.put(
  "/blogposts/:blogPostId/updateCover",

  authorize(),

  upload.single("cover"),

  param("blogPostId")
    .custom(BlogPostValidation.checkId),
  body("cover")
    .custom(BlogPostValidation.coverValidator),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const coverFile = req.file as Express.Multer.File;

    await BlogPostController.updateCover(blogPostId, coverFile);

    res.sendStatus(204);
  })
);

router.put(
  "/blogposts/:blogPostId/updateTags",

  authorize(),

  param("blogPostId")
    .custom(BlogPostValidation.checkId),

  body("tags")
    .customSanitizer(transformIntoStringArray),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const { tags } = req.body;

    await BlogPostController.updateTags(blogPostId, tags);

    res.sendStatus(204);
  })
);

export default router;
