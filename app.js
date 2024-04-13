import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import logger from "morgan";

import protect from "./lib/protected.middleware.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
dotenv.config();

const app = express();
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.status(StatusCodes.OK).send({
      message:
        "Welcome to node-jwt-auth. this is the index route login to access profile route",
    });
  })
);
app.use("/auth", authRouter);
app.use("/profile", protect, userRouter);
app.use((err, req, res, next) => {
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || "Internal Server Error" });
});
export default app;
