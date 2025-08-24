import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { parcelValidationSchema } from "./parcel.validation";


const router = Router();

// router.post('/create', ParcelController.createParcel)

router.post(
  '/create',
  checkAuth(...Object.values(UserRole)),
  validateRequest(parcelValidationSchema),
  ParcelController.createParcel
);

router.get('/my-parcels', checkAuth(...Object.values(UserRole)), ParcelController.getMyParcels);

router.get('/my-parcels', checkAuth(...Object.values(UserRole)), ParcelController.getMyParcels);

router.get('/', checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), ParcelController.getAllParcelsForAdmin)

router.patch('/cancel/:parcelId', checkAuth(...Object.values(UserRole)), ParcelController.cancelParcel);

router.patch('/confirm/:parcelId', checkAuth(UserRole.RECEIVER), ParcelController.confirmDelivery);

router.patch('/update-status/:parcelId', checkAuth(UserRole.ADMIN),
ParcelController.updateParcelStatus)

export const ParcelRoutes = router;