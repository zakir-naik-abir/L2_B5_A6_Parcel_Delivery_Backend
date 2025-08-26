import httpStatus from "http-status-codes";
import { AuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import bcryptjs from "bcryptjs";
import AppError from "../../error/AppError";
import { JwtPayload } from "jsonwebtoken";

// create user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: AuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

// get all users
// const getAllUsers = async (query: Record<string, string>) => {
//   const queryBuilder = new QueryBuilder(User.find(), query);

//   const userData = queryBuilder
//     .filter()
//     .search(userSearchableFields)
//     .sort()
//     .fields()
//     .paginate();

//   const [data, meta] = await Promise.all([
//     userData.build(),
//     queryBuilder.getMeta(),
//   ]);

//   return {
//     data,
//     meta,
//   };
// };

const getAllUsers = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit);
  const total = await User.countDocuments();

  return { meta: { page, limit, total }, data: users };
};


const getAllDeliveryMen = async (): Promise<IUser[]> => {
  const deliveryMen = await User.find({ role: 'SENDER', status: 'active' }).select('name email role');
  return deliveryMen;
};

// get me
const userProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user
  }
};

// get single user
const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user
  }
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {

  if (
    decodedToken.role === UserRole.SENDER ||
    decodedToken.role === UserRole.RECEIVER
  ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    decodedToken.role === UserRole.ADMIN &&
    isUserExist.role === UserRole.SUPER_ADMIN
  ) {
    throw new AppError(401, "You are not authorized");
  }

  if(payload.role){
    if (decodedToken.role === UserRole.SENDER ||
    decodedToken.role === UserRole.RECEIVER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if (decodedToken.role === UserRole.SENDER ||
    decodedToken.role === UserRole.RECEIVER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

// block toggle 
const updateUserStatus = async (userId: string, status: 'active' | 'blocked') => {
  return await User.findByIdAndUpdate(userId, { status }, { new: true });
};

// user toggle status
// const toggleBlockStatus = async (userId: string, isBlocked: boolean) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     { isBlocked: isBlocked },
//     { new: true }
//   );

//   if (!updatedUser) {
//     throw new Error("User not found");
//   }

//   console.log(
//     `User with ID: ${userId} has been ${isBlocked ? "blocked" : "unblocked"}.`
//   );
//   const result = {
//     id: userId,
//     name: "Test User",
//     isBlocked: isBlocked,
//   };
//   return result;
// };

// block status
const toggleBlockStatus = async (id: string, status: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: 'blocked' },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  console.log(
    `User with ID: ${id} has been ${status ? "blocked" : "active"}.`
  );
  const result = {
    id: id,
    name: "Test User",
    status: status,
  };
  return result;
};

const toggleUnblockStatus = async (id: string, status: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status: 'active' },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  console.log(
    `User with ID: ${id} has been ${status ? "blocked" : "active"}.`
  );
  const result = {
    id: id,
    name: "Test User",
    status: status,
  };
  return result;
};

const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  getAllDeliveryMen,
  updateUser,
  userProfile,
  toggleBlockStatus,
  toggleUnblockStatus,
  updateUserStatus,
  deleteUser
};
