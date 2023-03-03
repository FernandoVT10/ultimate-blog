import { Router } from "express";
import { checkSchema } from "express-validator";

import authorize from "../middlewares/authorize";
import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";
import CommentValidation from "../validation/CommentValidation";
import CommentService from "../services/CommentService";

const router = Router();

router.post(
  "/comments",

  checkSchema({
    authorName: CommentValidation.authorName,
    content: CommentValidation.content,
    parentType: CommentValidation.parentType,
    parentId: CommentValidation.parentId
  }),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const createdComment = await CommentService.create({
      authorName: req.body.authorName,
      content: req.body.content,
      parentType: req.body.parentType,
      parentId: req.body.parentId
    });

    res.json(createdComment);
  }
));

router.delete(
  "/comments/:commentId",

  authorize(),

  checkSchema({
    commentId: CommentValidation.commentId
  }),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const deletedComment = await CommentService.deleteById(req.params.commentId);

    res.json(deletedComment);
  }
));

export default router;
