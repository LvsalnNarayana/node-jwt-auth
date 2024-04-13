import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    const profile = await prisma.user.findUnique({
      select: {
        email: true,
        firstname: true,
        id: true,
        lastname: true,
      },
      where: {
        id: user.id,
      },
    });
    res.status(StatusCodes.OK).json(profile);
  } catch (error) {
    next(error);
  }
});
