import { Router } from "express";
import { body } from "express-validator";

import asyncHandler from "express-async-handler";
import AdminService from "../services/AdminService";
import checkValidation from "../middlewares/checkValidation";
import getAuthTokenFromRequest from "../utils/getAuthTokenFromRequest";

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

router.get("/admin/islogged", asyncHandler(async (req, res) => {
  const authToken = getAuthTokenFromRequest(req);

  const isLogged = await AdminService.isLogged(authToken);

  res.json({ isLogged });
}));

export default router;
