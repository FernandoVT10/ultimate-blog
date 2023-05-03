import { Router } from "express";
import { body } from "express-validator";

import asyncHandler from "express-async-handler";
import AdminService from "../services/AdminService";
import checkValidation from "../middlewares/checkValidation";

const router = Router();

router.post(
  "/admin/login",

  body("password")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage("Password is required")
    .custom(AdminService.checkPassword),

  checkValidation(),

  asyncHandler(async (req, res) => {
    const { password } = req.body;
    const token = await AdminService.getAuthToken(password);
    res.json({ token });
  })
);

// router.get("/admin/status", asyncHandler(async (req, res) => {
//   const authToken = req.cookies[AUTH_COOKIE_KEY];
//
//   const status = await AdminController.checkStatus(authToken);
//
//   res.json(status);
// }));

export default router;
