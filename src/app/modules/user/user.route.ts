import { Router } from "express";
import { UserControllers } from "./user.controller";
import { UserRole } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateZodSchema } from "./user.validation";


const router = Router();

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser);

router.get('/', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserControllers.getAllUsers);

router.get('/deliveryMen', checkAuth(...Object.values(UserRole)), UserControllers.getAllDeliveryMen);

router.get('/profile', checkAuth(...Object.values(UserRole)), UserControllers.userProfile);

router.get('/:id', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserControllers.getSingleUser);

router.patch('/:id', validateRequest(updateZodSchema), checkAuth(...Object.values(UserRole)), UserControllers.updateUser);

router.patch('/status/:id', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserControllers.updateUserStatus);

router.delete('/delete/:id', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserControllers.deleteUser);

router.patch('/block/:id', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserControllers.blockUser);

router.patch('/unblock/:id', checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserControllers.unblockUser);


export const UserRoutes = router;