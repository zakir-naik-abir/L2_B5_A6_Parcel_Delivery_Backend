
import { Types } from "mongoose";

export type IParcelStatus = "Requested" | "Approved" | "Dispatched" | "In-Transit" | "Delivered" | "Cancelled" | "Confirmed";

export interface IStatusLog{
  status: IParcelStatus;
  timestamp: Date;
  updateBy: Types.ObjectId;
  notes?: string;
};

export interface IParcel {
   sender: Types.ObjectId;
   receiverName: string;
   receiverPhone: string;
   deliveryAddress: string;
   requestedDeliveryDate: Date;
   parcelWeight: number;
   parcelType: string;
   deliveryFee: number;
   trackingId: string;
   status: IParcelStatus;
   statusHistory: IStatusLog[];
   deliveryMan?: Types.ObjectId;
};