import z from "zod";

export const parcelValidationSchema = z.object({
  body: z.object({
    receiverName: z.string(),
    receiverPhone: z.string(),
    deliveryAddress: z.string(),
    requestedDeliveryDate: z.string().transform((str) => new Date(str)),
    parcelWeight: z.number(),
    parcelType: z.string(),
    deliveryFee: z.number().optional(),
    
  }),
});