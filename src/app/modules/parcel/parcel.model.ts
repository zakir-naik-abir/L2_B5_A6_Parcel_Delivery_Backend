
import { model, Schema } from "mongoose";
import { IParcel, IStatusLog } from "./parcel.interface";

const statusLogSchema = new Schema<IStatusLog>({
  status: { type: String, enum: [
    'Requested', 'Approved', 'Dispatched', 'In-Transit', 'Delivered', 'Cancelled', 'Confirmed'
  ], required: true },
  timestamp: { type: Date, default: Date.now },
  updateBy: { type: Schema.Types.ObjectId, ref: 'User'},
  notes: { type: String }
}, {
  versionKey: false
});

const parcelSchema = new Schema<IParcel>({
  sender: { type: Schema.Types.ObjectId, ref: 'User',  },
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  requestedDeliveryDate: { type: Date },
  parcelWeight: { type: Number, required: true },
  parcelType: { type: String, required: true },
  deliveryFee: { type: Number, default: 0 },
  trackingId: { type: String },
  status: { type: String, enum: [
    'Requested', 'Approved', 'Dispatched', 'In-Transit', 'Delivered', 'Cancelled', 'Confirmed'
  ], default: 'Requested' },
  deliveryMan: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  statusHistory: [statusLogSchema],
}, {
  timestamps: true,
  versionKey: false
});

parcelSchema.pre('save', function (next) {
  if(this.isNew){
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.trackingId = `TRK-${year}${month}${day}-${randomChars}`;

    this.statusHistory.push({
      status: "Requested",
      timestamp: new Date(),
      updateBy: this.sender,
      notes: `Parcel creation request received.`
    });
  }
  next();
});

export const Parcel = model<IParcel>('Parcel', parcelSchema);