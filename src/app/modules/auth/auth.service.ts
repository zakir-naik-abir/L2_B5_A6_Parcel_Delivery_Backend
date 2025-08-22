/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { AuthProvider, IsActive } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(decodedToken.id);

  if (!isUserExist) {
    throw new AppError(401, "You are not exist");
  }

  if (payload.id != decodedToken.id) {
    throw new AppError(401, "You can not reset your password");
  }

  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );


  isUserExist.password = hashedPassword;

  await isUserExist.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your account is not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your account is not verified");
  }
  if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `Your account is ${isUserExist.isActive}`);
  }
  if (isUserExist.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, `Your account is blocked}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, `Your account is deleted}`);
  }
  

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const setPassword = async (id: string, plainPassword: string) => {
  console.log(id)
  const user = await User.findById(id);
  console.log(user)

  if (!user) {
    throw new AppError(404, "Your account is not found");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: AuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: AuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken._id).select('+password');

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your old password is incorrect");
  }

  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user.save();
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  forgotPassword,
  setPassword,
  changePassword,
};
