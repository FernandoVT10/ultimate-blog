import BlogPostService from "../services/BlogPostService";
import BlogPostValidation from "../validation/BlogPostValidation";

import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";
import authorize from "../middlewares/authorize";
import validators from "../utils/validators";
import createMulterInstance from "../utils/createMulterInstance";

import { query, param } from "express-validator";
import { Router, Request } from "express";

const router = Router();
const multerInstance = createMulterInstance();

interface GetBlogPostsQuery {
  tags?: string[];
  limit?: number;
}

router.get(
  "/blogposts/",
  query("limit").toInt(),
  // eslint-disable-next-line @typescript-eslint/ban-types
  asyncHandler(async (req: Request<{}, {}, {}, GetBlogPostsQuery>, res) => {
    const { limit } = req.query;

    const blogPosts = await BlogPostService.getAll({ limit });

    res.json(blogPosts);
  })
);

router.get(
  "/blogposts/:blogPostId",

  param("blogPostId").custom(validators.validateId),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const blogPostId = req.params?.blogPostId;
    const blogPost = await BlogPostService.getById(blogPostId);
    res.json(blogPost);
  })
);

router.post(
  "/blogposts",

  authorize(),

  multerInstance.single("cover"),
  
  BlogPostValidation.createCoverChain(),
  BlogPostValidation.createTitleChain(),
  BlogPostValidation.createContentChain(),
  BlogPostValidation.createTagsChain(),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { title, content, tags } = req.body;
    const imageFile = req.file as Express.Multer.File;

    const createdPost = await BlogPostService.createOne({
      title, content, tags, imageFile
    });

    res.json(createdPost);
  })
);

router.put(
  "/blogposts/:blogPostId/updateTitle",

  authorize(),

  BlogPostValidation.createPostIdChain(),
  BlogPostValidation.createTitleChain(),
  checkValidation(),

  BlogPostValidation.existsBlogPost(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const { title } = req.body;

    await BlogPostService.updateTitle(blogPostId, title);

    res.sendStatus(204);
  })
);

router.put(
  "/blogposts/:blogPostId/updateContent",

  authorize(),

  BlogPostValidation.createPostIdChain(),
  BlogPostValidation.createContentChain(),
  checkValidation(),

  BlogPostValidation.existsBlogPost(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const { content } = req.body;

    await BlogPostService.updateContent(blogPostId, content);

    res.sendStatus(204);
  })
);

router.put(
  "/blogposts/:blogPostId/updateCover",

  authorize(),

  multerInstance.single("cover"),

  BlogPostValidation.createCoverChain(),
  BlogPostValidation.createPostIdChain(),
  checkValidation(),

  BlogPostValidation.existsBlogPost(),

  asyncHandler(async (req, res) => {
    const { blogPostId } = req.params;
    const coverFile = req.file as Express.Multer.File;

    await BlogPostService.updateCover(blogPostId, coverFile);

    res.sendStatus(204);
  })
);
//
// router.put(
//   "/blogposts/:blogPostId/updateTags",
//
//   authorize(),
//
//   param("blogPostId")
//     .custom(BlogPostValidation.checkId),
//
//   body("tags")
//     .customSanitizer(transformIntoStringArray),
//
//   checkValidation(),
//
//   asyncHandler(async (req, res) => {
//     const { blogPostId } = req.params;
//     const { tags } = req.body;
//
//     await BlogPostService.updateTags(blogPostId, tags);
//
//     res.sendStatus(204);
//   })
// );
//
// router.delete(
//   "/blogposts/:blogPostId",
//
//   authorize(),
//
//   param("blogPostId")
//     .custom(BlogPostValidation.checkId),
//
//   checkValidation(),
//
//   asyncHandler(async (req, res) => {
//     const { blogPostId } = req.params;
//
//     const deletedBlogPost = await BlogPostService.deletePost(blogPostId);
//
//     res.json(deletedBlogPost);
//   })
// );

export default router;
