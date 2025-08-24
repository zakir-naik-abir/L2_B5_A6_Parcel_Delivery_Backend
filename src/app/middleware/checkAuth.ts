import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";


export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const accessToken = req.cookies.accessToken || req.headers.authorization;

      // const accessToken = req.headers.authorization || req.cookies.authorization ;


      // if (!accessToken) {
      //   throw new AppError(403, "No Token Received");
      // }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      // const { role, userId } = verifiedToken;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      // const isUserExist = await User.findById(userId);

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your are not exist");
      }

      
      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your account is not verified");
      }

      if (isUserExist.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your account is blocked");
      }
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(401, "You are not permitted to view this route!!");
      }
      // if(!authRoles.includes(isUserExist.role)){
      //   throw new AppError(401, "You are not permitted this route")
      // }
      req.user = isUserExist;
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
