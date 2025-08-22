import { any, email } from 'zod';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import {  Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { IParcel } from "./parcel.interface";
import AppError from "../../error/AppError";
import { Parcel } from "./parcel.model";
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

const createParcel = catchAsync(
  async (req: Request, res: Response, ) => {
    // const imagePaths = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

    const payload: Partial<IParcel> = {
      ...req.body,
      sender: req.user?.userId
      // images: imagePaths,
    };
    console.log(payload)

    // const senderId = req.user?.userId;

    const result = await ParcelService.createParcel(payload as IParcel);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Parcel created successfully",
      data: result,
    });
  }
);



// export const createParcel = async (req: Request, res: Response) => {
//   try {
//     console.log('--- Inside createParcel Controller ---');
    
//     console.log('1. req.user object:', req.user); 

//     const senderId = req.user?.userId || req.user?.userId;
//     console.log('2. Extracted Sender ID:', senderId);

//     const parcelPayload = req.body;
//     console.log('3. Request Body from Frontend:', parcelPayload);

//     if (!senderId) {
//       return res.status(401).json({ success: false, message: 'Authentication error: Sender ID not found.' });
//     }

//     const finalData = {
//       ...parcelPayload,
//       sender: new Types.ObjectId(senderId),
//       statusHistory: [{ 
//           status: 'Requested',
//           updateBy: new Types.ObjectId(senderId),
//           timestamp: new Date()
//       }]
//     };
//     console.log('4. Final data object to be saved:', finalData);

//     const newParcel = await Parcel.create(finalData);

//     res.status(201).json({ 
//       success: true, 
//       message: 'Parcel created successfully!',
//       data: newParcel 
//     });

//   } catch (error) {
//     console.error('Error creating parcel:', error); 
//     throw new AppError(500, "err")
//     // res.status(500).json({ success: false, message: error.message });
//   }
// };

const getMyParcels = catchAsync(async (req: Request, res: Response, ) =>{
  

  const user = req.user;

  if(!user){
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized")
  }

  const result = await ParcelService.getMyParcels(user as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcels retrieved successfully",
    data: result
  });
});


const getAllParcelsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ParcelService.getAllParcelsForAdmin();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Parcels retrieved successfully",
      data: result,
    });
  }
);

const updateParcelStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { parcelId } = req.params;
    const { status } = req.body;

    const result = await ParcelService.updateParcelStatus(req.user!, parcelId, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Parcel status updated successfully",
      data: result,
    });
  }
);

const cancelParcel = catchAsync(
  async (req: Request, res: Response) => {
    const { parcelId } = req.params;

    const result = await ParcelService.cancelParcel(req.user!, parcelId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Parcel cancelled successfully",
      data: result,
    });
  }
);

const confirmDelivery = catchAsync(
  async (req: Request, res: Response) => {
    const { parcelId} = req.params;

    const result = await ParcelService.confirmDelivery(req.user as any, parcelId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Parcel delivery confirmed successfully",
      data: result,
    });
  }
);

export const ParcelController = {
  createParcel,
  getMyParcels,
  getAllParcelsForAdmin,
  updateParcelStatus,
  cancelParcel,
  confirmDelivery
};
