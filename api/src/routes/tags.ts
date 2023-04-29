import { Router } from "express";
// import { body } from "express-validator";
// import { NAME_MAX_LENGTH } from "../models/Tag";

import asyncHandler from "express-async-handler";
// import TagService from "../services/TagService";
// import authorize from "../middlewares/authorize";
// import checkValidation from "../middlewares/checkValidation";
import TagRepository from "../repositories/TagRepository";

const router = Router();

/**
* @swagger
* components:
*   schemas:
*     Tag:
*       type: object
*       properties:
*         _id:
*           type: string
*         name:
*           type: string
*
* tags: [name: tag]
*/

/**
* @swagger
* /tags:
*   get:
*     tags: [tag]
*     description: Returns all tags
*     responses:
*       200:
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: "#/components/schemas/Tag"
*
* */
router.get("/tags", asyncHandler(async (_, res) => {
  const tags = await TagRepository.getAll();

  res.json(tags);
}));

// router.post(
//   "/tags",
//
//   authorize(),
//
//   body("name")
//     .exists({ checkFalsy: true, checkNull: true })
//     .withMessage("Name is required")
//     .isString()
//     .withMessage("Name must be a string")
//     .isLength({ max: NAME_MAX_LENGTH })
//     .withMessage(`Name can't be larger than ${NAME_MAX_LENGTH} characters`)
//     .custom(async (name) => {
//       if(await TagService.checkNameExists(name)) {
//         throw new Error(`A tag called "${name}" already exists`);
//       }
//     }),
//
//   checkValidation(),
//
//   asyncHandler(async (req, res) => {
//     const { name } = req.body;
//
//     await TagService.createOne(name);
//
//     res.sendStatus(204);
//   })
// );

export default router;
