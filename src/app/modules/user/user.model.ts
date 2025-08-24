import bcryptjs from "bcryptjs";
import { model, Schema } from "mongoose";
import { envVars } from "../../config/env";
import { AuthProvider, IsActive, IUser } from "./user.interface";

const authProviderSchema = new Schema<AuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "SENDER", "RECEIVER", "DELIVERYMAN"],
      default: 'RECEIVER',
      required: true
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && this.password) {
    this.password = await bcryptjs.hash(
      this.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await this.findOne({ email }).select("+password");
};

export const User = model<IUser>("User", userSchema);
