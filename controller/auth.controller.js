import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const loginController = asyncHandler(async (req, res, next) => {
  try {
    const { email: user_email, password: user_password } = req.body;
    const user = await prisma.user.findFirst({
      select: {
        email: true,
        firstname: true,
        id: true,
        lastname: true,
        password: true,
      },
      where: {
        email: user_email,
      },
    });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(user_password, user.password);
    if (!passwordMatch) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    res.cookie("authToken", token, { httpOnly: true });
    res.status(StatusCodes.OK).json({ message: "logged in successfully" });
  } catch (error) {
    next(error);
  }
});

export const registerController = asyncHandler(async (req, res, next) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (checkUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await prisma.user.create({
        data: {
          email: email,
          firstname: firstname,
          lastname: lastname,
          password: hashedPassword,
        },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ message: "User created successfully", newUser });
    }
  } catch (error) {
    next(error);
  }
});

export const signoutController = asyncHandler(async (req, res, next) => {
  try {
    // Clear the authToken cookie
    res.clearCookie("authToken");
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});
