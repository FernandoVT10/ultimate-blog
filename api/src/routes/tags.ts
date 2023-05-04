import { Router } from "express";
import { NAME_MAX_LENGTH } from "../models/Tag";

import asyncHandler from "express-async-handler";
import authorize from "../middlewares/authorize";
import checkValidation from "../middlewares/checkValidation";
import validators from "../utils/validators";
import TagRepository from "../repositories/TagRepository";

const router = Router();

router.get("/tags", asyncHandler(async (_, res) => {
  const tags = await TagRepository.getAll();

  res.json(tags);
}));

router.post(
  "/tags",

  authorize(),

  validators.stringValidator("name", NAME_MAX_LENGTH)
    .custom(async (name) => {
      if(await TagRepository.checkNameExists(name)) {
        throw new Error(`A tag called "${name}" already exists`);
      }
    }),
  checkValidation(),

  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const createdTag = await TagRepository.createOne(name);
    res.json(createdTag);
  })
);

export default router;
