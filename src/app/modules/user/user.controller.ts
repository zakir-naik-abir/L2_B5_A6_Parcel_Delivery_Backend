/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  });
});

// get all user
// const getAllUsers = catchAsync(async (req: Request, res: Response) =>{
//   const query = req.query;
//   const result = await UserServices.getAllUsers(query as Record<string, string>);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "All Users Retrieved Successfully",
//     data: result.data,
//     meta: result.meta
//   })
// });

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsers(req.query);
    res
      .status(200)
      .json({
        success: true,
        message: "Users retrieved successfully",
        ...result,
      });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllDeliveryMen = catchAsync(async (req: Request, res: Response) => {
  const deliveryMen = await UserServices.getAllDeliveryMen();
  res.status(200).json({
    success: true,
    message: "Delivery men retrieved successfully",
    data: deliveryMen,
  });
});

// get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result.data,
  });
});

// User Profile
const userProfile = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const result = await UserServices.userProfile(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Retrieved Successfully",
    data: result.data,
  });
});

// update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const verifiedToken = req.user;

  const user = await UserServices.updateUser(
    userId,
    payload,
    verifiedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Update Successfully",
    data: user,
  });
});


// block user
const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.toggleBlockStatus(id, "blocked");
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User blocked successfully",
    data: result,
  });
};

// unblock user
const unblockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.toggleUnblockStatus(id, "active");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User unblocked successfully",
    data: result,
  });
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const result = await UserServices.updateUserStatus(userId, status);
    res
      .status(200)
      .json({
        success: true,
        message: "User status updated successfully",
        data: result,
      });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await UserServices.deleteUser(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getAllDeliveryMen,
  getSingleUser,
  userProfile,
  updateUser,
  blockUser,
  unblockUser,
  updateUserStatus,
  deleteUser,
};
