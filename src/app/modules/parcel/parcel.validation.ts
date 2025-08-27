import z from "zod";

export const parcelValidationSchema = z.object({
  senderName: z.string(),
  receiverName: z.string(),
  receiverPhone: z.string(),
  deliveryAddress: z.string(),
  requestedDeliveryDate: z.string().transform((str) => new Date(str)).optional(),
  // parcelWeight: z.number().optional(),
  parcelType: z.string(),
  deliveryFee: z.number().optional(),
});


export const createParcelZodSchema = z.object({
  body: z.object({
    receiverName: z.string({  error:'Receiver name is required' }),
    receiverAddress: z.string({  error:'Receiver address is required' }),
    receiverPhone: z.string({  error:'Receiver phone is required' }),
    parcelWeight: z.string({ error: 'Parcel weight is required' }),
    parcelType: z.string({ error: 'Parcel type is required' }),
    requestedDeliveryDate: z.string().optional(), 
    deliveryFee: z.number().optional().default(0),
  }),
});

export const updateParcelZodSchema = z.object({
  body: z.object({
    receiverName: z.string().optional(),
    receiverAddress: z.string().optional(),
    receiverPhone: z.string().optional(),
    parcelWeight: z.number().optional(),
    parcelType: z.string().optional(),
    requestedDeliveryDate: z.string().optional(),
    deliveryFee: z.number().optional(),
    deliveryMan: z.string().optional(), 
    currentStatus: z
      .enum(['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'])
      .optional(),
    notes: z.string().optional(), 
  }),
});

export const ParcelValidation = {
  createParcelZodSchema,
  updateParcelZodSchema,
};