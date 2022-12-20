import { AUTH_COOKIE_KEY, PRODUCTION } from "../config/constants";
import { Router } from "express";
import { body } from "express-validator";

import asyncHandler from "express-async-handler";
import AdminController from "../controllers/AdminController";
import checkValidation from "../middlewares/checkValidation";

const router = Router();

router.post(
  "/admin/login",

  body("password")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("Password is required")
    .custom(AdminController.validatePassword),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const { password } = req.body;

    const token = await AdminController.login(password);

    res.cookie(AUTH_COOKIE_KEY, token, {
      secure: PRODUCTION,
      httpOnly: true,
      sameSite: true
    }).json({
      message: "You've been logged in!"
    });
  })
);

router.get("/admin/status", asyncHandler(async (req, res) => {
  const authToken = req.cookies[AUTH_COOKIE_KEY];

  const status = await AdminController.checkStatus(authToken);

  res.json(status);
}));

export default router;
