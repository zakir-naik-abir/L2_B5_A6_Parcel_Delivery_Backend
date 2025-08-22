import httpStatus from 'http-status-codes';
import { IsActive, IUser } from "../modules/user/user.interface";
import { envVars } from '../config/env';
import { generateToken, verifyToken } from './jwt';
import { User } from '../modules/user/user.model';
import AppError from '../error/AppError';
import { JwtPayload } from 'jsonwebtoken';

export const createUserToken = (user: Partial<IUser>) =>{
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role
  }
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES_IN);

  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);

  return {
    accessToken,
    refreshToken
  }
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) =>{
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
  };
  if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
  };
  if(isUserExist.isBlocked){
    throw new AppError(httpStatus.BAD_REQUEST, "user is blocked")
  };

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES_IN);

  return accessToken
};