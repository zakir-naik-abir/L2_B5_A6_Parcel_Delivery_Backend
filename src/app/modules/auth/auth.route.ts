import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

router.post("/logout", AuthControllers.logout);

router.post("/refresh-token", AuthControllers.getNewAccessToken);

router.post(
  "/change-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.changePassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.resetPassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.setPassword
);
router.post("/forgot-password", AuthControllers.forgotPassword);


router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
