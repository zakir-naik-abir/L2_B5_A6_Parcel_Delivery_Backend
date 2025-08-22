// import { Types } from "mongoose";

// export type IParcelStatus = "Requested" | "Approved" | "Dispatched" | "In-Transit" | "Delivered" | "Cancelled" | "Confirmed";

// export interface IStatusLog {
//   status: IParcelStatus;
//   timestamp: Date;
//   updateBy: Types.ObjectId;
//   notes?: string;
// };

// export interface IParcel {
//    sender: Types.ObjectId;
//    receiverName: string;
//    receiverPhone: string;
//    receiverAddress: string;
//    deliveryAddress: string;
//    requestedDeliveryDate: Date;
//    parcelWeight: number;
//    parcelType: string;
//    deliveryFee: number;
//    trackingId: string;
//    status: IParcelStatus;
//    statusHistory: IStatusLog[];
// };

import {  Types } from "mongoose";

// 1. Define the type for parcel status
export type IParcelStatus = "Requested" | "Approved" | "Dispatched" | "In-Transit" | "Delivered" | "Cancelled" | "Confirmed";

// 2. Define the interface for a single status log entry
export interface IStatusLog {
  status: IParcelStatus;
  timestamp: Date;
  updateBy: Types.ObjectId; // The user who updated the status
  notes?: string;
}

// 3. Define the main interface for a Parcel document
export interface IParcel {
   sender: Types.ObjectId; // The user who is sending the parcel
   receiverName: string;
   receiverPhone: string;
   receiverAddress: string;
   deliveryAddress: string;
   requestedDeliveryDate: Date;
   parcelWeight: number;
   parcelType: string;
   deliveryFee: number;
   trackingId?: string; // It's better to make it optional if it's generated later
   status: IParcelStatus;
   statusHistory: IStatusLog[];
}

