
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type IParcelStatus = "requested" | "approved" | "dispatched" | "in-transit" | "delivered" | "cancelled" | "confirmed" | "assigned" | "picked_up" | "pending"

export interface IStatusLog{
  status: string;
  timestamp: Date;
  updateBy: Types.ObjectId | IUser;
  notes?: string;
};

export interface IParcel {
  _id: Types.ObjectId;
   sender: Types.ObjectId | IUser;
   senderName: string;
   receiverName: string;
   receiverPhone: string;
   deliveryAddress: string;
   requestedDeliveryDate: Date;
  //  parcelWeight?: number;
   parcelType: string;
   deliveryFee?: number;
   trackingId: string;
   deliveryMan?: Types.ObjectId | IUser; 
  status: string;
  //  status: IParcelStatus;
   statusHistory: IStatusLog[];
};