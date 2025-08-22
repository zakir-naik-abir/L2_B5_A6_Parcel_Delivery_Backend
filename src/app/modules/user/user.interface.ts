import { Types } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER"
};

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED"
}

export interface AuthProvider {
  provider: "google" | "credentials";
  providerId: string;
};

export interface IUser {
  _id?: Types.ObjectId
  name: string
  email: string
  password?: string
  phone?: string
  picture?: string
  address?: string
  isVerified?: boolean
  isActive?: IsActive
  isBlocked?: string
  isDeleted?: string
  role: UserRole
  auths: AuthProvider[]
  createdAt?: Date
};