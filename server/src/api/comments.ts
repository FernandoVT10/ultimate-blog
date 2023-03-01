import { Router } from "express";
import { checkSchema } from "express-validator";

import authorize from "../middlewares/authorize";
import asyncHandler from "express-async-handler";
import checkValidation from "../middlewares/checkValidation";
import CommentValidation from "../validation/CommentValidation";
import CommentService from "@app/services/CommentService";

const router = Router();

router.post(
  "/comments",

  checkSchema({
    authorName: CommentValidation.authorName,
    content: CommentValidation.content,
    repliedToModel: CommentValidation.repliedToModel,
    repliedTo: CommentValidation.repliedTo
  }),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const createdComment = await CommentService.create({
      authorName: req.body.authorName,
      content: req.body.content,
      repliedToModel: req.body.repliedToModel,
      repliedTo: req.body.repliedTo
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
