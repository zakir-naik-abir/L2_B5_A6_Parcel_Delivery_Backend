import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
// import { authCheck } from "../../middleware/authCheck";
// import { IUserRole } from "../user/user.interface";
// import { validateRequest } from "../../middleware/validateRequest";
// import { updateZodSchema } from "../user/user.validation";

const router = Router();

// router.post('/create', ParcelController.createParcel)

router.post(
  '/create',
  checkAuth(...Object.values(UserRole)),
  // validateRequest(createParcelValidationSchema),
  ParcelController.createParcel
);

router.get('/my-parcels', checkAuth(...Object.values(UserRole)), ParcelController.getMyParcels);

router.get('/my-parcels', checkAuth(...Object.values(UserRole)), ParcelController.getMyParcels);

router.get('/all-parcel', checkAuth(UserRole.ADMIN), ParcelController.getAllParcelsForAdmin)

router.patch('/cancel/:parcelId', checkAuth(...Object.values(UserRole)), ParcelController.cancelParcel);

router.patch('/confirm/:parcelId', checkAuth(UserRole.RECEIVER), ParcelController.confirmDelivery);

router.patch('/update-status/:parcelId', checkAuth(UserRole.ADMIN),
ParcelController.updateParcelStatus)

export const ParcelRoutes = router;