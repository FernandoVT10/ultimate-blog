import { Router } from "express";

import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";

import CommentService from "../services/CommentService";
import CommentValidation from "../validation/CommentValidation";

const router = Router();

router.get(
  "/comments/",

  // important, this validation must be before of the parentId one
  CommentValidation.createParentModelChain(true),
  CommentValidation.createParentIdChain(true),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { parentId, parentModel } = req.query as any;

    const comments = await CommentService.getAllByIdAndModel(parentId, parentModel);

    res.json(comments);
  })
);

router.post(
  "/comments",

  CommentValidation.createAuthorNameChain(),
  CommentValidation.createContentChain(),
  // important, this validation must be before of the parentId one
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
