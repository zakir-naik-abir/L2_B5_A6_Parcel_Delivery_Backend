/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { User } from "../user/user.model";
import AppError from "../../error/AppError";


const createParcel = async (payload: IParcel) => {
 
  // payload.deliveryFee = (payload.parcelWeight || 0 ) * 50;

  // payload.deliveryFee = (payload.parcelWeight || 0 ) * 50;
//   const parcelWeight = payload(parseFloat(parcelWeight))
//   const pf = parseFloat(parcelWeight)
// console.log(parcelWeight)
  // const pf = parcelWeight(parseInt)


  const result = await Parcel.create(payload);
  return result;
};

const getMyParcels = async (user: JwtPayload) => {


  const userRole = user.role?.toLowerCase();
  const userId = user?.userId;

  if (!userRole || !userId) {
    console.error('Error: Role or ID not found in user model instance.');
    return [];
  }

  if (userRole === 'sender') {
    const parcels = await Parcel.find({ sender: userId })
    return parcels;
  }

  if (userRole === 'receiver') {
   
    const receiverPhone = user.phone;

    if (!receiverPhone) {
      console.log('Receiver has no phone number in their profile.');
      return [];
    }

    const parcels = await Parcel.find({ receiverPhone: receiverPhone }).populate(
      'sender',
      'name email',
    );
    console.log(`Parcels found for receiver: ${parcels.length}`);
    return parcels;
  }
  return [];
};


const getAllParcelsForAdmin = async () =>{
  return await Parcel.find().populate('sender', 'name email')
};

const updateParcelStatus = async (user: JwtPayload, parcelId: string, status: IParcel['status']) =>{
  const parcel = await Parcel.findById(parcelId);

  if(!parcel){
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  parcel.status = status;
  parcel.statusHistory.push({
    status: status,
    timestamp: new Date(),
    updateBy: user.userId,
    notes: `Status updated to ${status} by admin`
  });
  await parcel.save();
  return parcel;
};

const cancelParcel = async (user: JwtPayload, parcelId: string) =>{
  const parcel = await Parcel.findById(parcelId);
  if(!parcel){
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found')
  }
  if(parcel.sender.toString() !== user.userId){
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this parcel')
  }
  if(parcel.status === 'dispatched' || parcel.status === 'Delivered'){
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot cancel a parcel that is already ${parcel.status})`)
  }

  parcel.status = 'cancelled';
  parcel.statusHistory.push({
    status: 'Cancelled',
    timestamp: new Date(),
    updateBy: user.userId,
    notes: 'Parcel cancelled by sender'
  });
  
  await parcel.save();
  return parcel;
};

const confirmDelivery = async (user: JwtPayload, parcelId: string) =>{
  const parcel = await Parcel.findById(parcelId);

  if(!parcel){
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  const receiverUser = await User.findById(user);
  if(!receiverUser){
    throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
  }
    console.log(parcel.receiverPhone)
    console.log(receiverUser.phone)
  if(parcel.receiverPhone !== receiverUser.phone){
    throw new AppError(httpStatus.FORBIDDEN, 'You are not the intended receiver of this parcel')
  }

  if(parcel.status !== 'Delivered'){
    throw new AppError(httpStatus.BAD_REQUEST, 'parcel is not marked as delivered yet')
  }
  parcel.status = 'Confirmed';
  parcel.statusHistory.push({
    status: 'Confirmed',
    timestamp: new Date(),
    updateBy: user.userId,
    notes: 'Delivery confirmed by receiver'
  });

  await parcel.save();
  return parcel;
};

export const ParcelService = {
  createParcel,
  getMyParcels,
  getAllParcelsForAdmin,
  updateParcelStatus,
  cancelParcel,
  confirmDelivery
};