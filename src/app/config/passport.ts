/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from 'bcryptjs';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

import { User } from "../modules/user/user.model";
import { envVars } from "./env";
import { IsActive, UserRole } from "../modules/user/user.interface";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done("Incorrect Email");
        };

        if (!isUserExist.isVerified) {
          return done("You are not verified");
        };

        if(isUserExist.isBlocked){
          return done("Your account is blocked")
        };

        if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
          return done(`Your account is ${isUserExist.isActive}`)
        };

        if(isUserExist.isDeleted){
          return done("Your account is deleted")
        };
        
        // if(!isUserExist.password){
        //   return done(null, false, { message: "Password is wrong"})
        // };
        
      
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Email and then you can login with email and password.",
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password is wrong" });
        }

        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email not founded" });
        }

        let isUserExist = await User.findOne({ email });

        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: "You account is not verified" });
        }
        
        
        if (isUserExist && isUserExist.isBlocked) {
          return done(null, false, { message: `You account is blocked` });
        }
        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: UserRole.SENDER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExist);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
