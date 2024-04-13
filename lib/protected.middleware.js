import asyncHandler from "express-async-handler";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import jwt from "jsonwebtoken";

const protect = asyncHandler(async (req, res, next) => {
  if (req.cookies.authToken) {
    // eslint-disable-next-line no-unused-vars
    const { exp, iat, ...user } = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET
    );
    if (Date.now() >= exp * 1000) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token expired",
      });
      res.clearCookie("authToken");
    } else {
      req.user = user;
      next();
    }
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
  }
});

export default protect;
