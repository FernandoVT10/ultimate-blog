import { Router } from "express";

import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";

import CommentService from "../services/CommentService";
import CommentValidation from "../validation/CommentValidation";

const router = Router();

router.post(
  "/comments",

  CommentValidation.createAuthorNameChain(),
  CommentValidation.createContentChain(),
  CommentValidation.createParentModelChain(),
  CommentValidation.createParentIdChain(),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { authorName, content, parentId, parentModel } = req.body;

    const createdComment = await CommentService.createOne({
      authorName, content, parentId, parentModel
    });

    res.json(createdComment);
  }),
);

export default router;
