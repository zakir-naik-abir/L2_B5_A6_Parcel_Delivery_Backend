import httpStatus from 'http-status-codes';
import {  Request, Response } from "express";
import { UserServices } from "./user.service";
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';


// create user
const createUser = catchAsync(async (req: Request, res: Response) =>{

  const user = await UserServices.createUser(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user,
  })
});

// get all user
const getAllUsers = catchAsync(async (req: Request, res: Response) =>{
  const query = req.query;
  const result = await UserServices.getAllUsers(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta
  })
});

const getAllDeliveryMen = catchAsync(async (req: Request, res: Response) => {
  const deliveryMen = await UserServices.getAllDeliveryMen();
  res.status(200).json({
    success: true,
    message: 'Delivery men retrieved successfully',
    data: deliveryMen,
  });
});

// get single user 
const getSingleUser = catchAsync(async (req: Request, res: Response) =>{
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);
console.log(id)
   sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Retrieved Successfully",
    data: result.data,
   })
});

// User Profile
const userProfile = catchAsync(async (req: Request, res: Response, ) =>{
  const decodedToken = req.user as JwtPayload;
  const result = await UserServices.userProfile(decodedToken.userId);
  console.log(result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Profile Retrieved Successfully",
    data: result.data,
   });
});

// update user 
const updateUser = catchAsync(async (req: Request, res: Response) =>{

  const userId = req.params.id;
  const payload = req.body;
  const verifiedToken = req.user
  
  const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Update Successfully",
    data: user,
   });
});

const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.toggleBlockStatus(id, true);
  res.status(200).json({ success: true, message: 'User blocked successfully', data: result });
};

const unblockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.toggleBlockStatus(id, false);
  res.status(200).json({ success: true, message: 'User unblocked successfully', data: result });
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getAllDeliveryMen,
  getSingleUser,
  userProfile,
  updateUser,
  blockUser,
  unblockUser
};