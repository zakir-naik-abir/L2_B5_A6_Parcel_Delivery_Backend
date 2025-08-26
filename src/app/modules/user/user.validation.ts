import z from "zod";
import { IsActive, UserRole } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  role: z.string().optional(),
  email: z
    .string()
    .email()
    .endsWith("@gmail.com", {message: "Enter your valid email"})
    .min(14, { message: "Email address too short" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .refine((email) => email === email.toLowerCase(), {message: "Email must be lowercase"})
    .regex( /^(?!\.)(?!.*\.\.)([A-Z0-9_'+-.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i, {
      message: "Enter your valid email"
      }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain as least 1 uppercase latter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain as least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain as least 1 number.",
    }),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
    .optional(),
  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),

});

export const updateZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
    .optional(),
  role: z
    .enum(Object.values(UserRole) as [string])
    .optional(),
  isVerified: z
    .boolean()
    .optional(),
  isActive: z
    .enum(Object.values(IsActive) as [string])
    .optional(),
  isDeleted: z
    .boolean()
    .optional(),
  isBlocked: z
    .boolean()
    .optional(),
  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});
