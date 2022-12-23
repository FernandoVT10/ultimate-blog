import { Router } from "express";
import { body } from "express-validator";

import TagService from "../services/TagService";
import asyncHandler from "express-async-handler";
import authorize from "../middlewares/authorize";
import checkValidation from "../middlewares/checkValidation";
import modelConfig from "../config/models";

const NAME_MAXLENGTH = modelConfig.tag.name.maxLength;

const router = Router();

router.get("/tags", asyncHandler(async (_, res) => {
  const tags = await TagService.getAll();

  res.json(tags);
}));

router.post(
  "/tags",

  authorize(),

  body("name")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: NAME_MAXLENGTH })
    .withMessage(`Name can't be larger than ${NAME_MAXLENGTH} characters`)
    .custom(async (name) => {
      if(await TagService.checkNameExists(name)) {
        throw new Error(`A tag called "${name}" already exists`);
      }
    }),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const { name } = req.body;

    await TagService.createOne(name);

    res.sendStatus(204);
  })
);

export default router;
