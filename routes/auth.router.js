import { Router } from "express";

import {
  loginController,
  registerController,
  signoutController,
} from "../controller/auth.controller.js";
const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/signout", signoutController);

export default router;
