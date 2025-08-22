import bcryptjs from 'bcryptjs';
import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import { AuthProvider, IUser, UserRole } from '../modules/user/user.interface';

export const sendSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL
    })

    if(isSuperAdminExist){
      console.log("👑 Super Admin Already Exists!");
      return
    };

    console.log("👑 Trying to create Super Admin..");

    const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: AuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL
    };

    const payload: IUser = {
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider]
    };

    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfully!");
    console.log(superAdmin)
  } catch (error) {
    console.log(error)
    return error
  }
};
