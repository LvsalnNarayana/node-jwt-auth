import { Router } from "express";

import { getUserProfile } from "../controller/user.controller.js";
const router = Router();

router.get("/", getUserProfile);

export default router;
