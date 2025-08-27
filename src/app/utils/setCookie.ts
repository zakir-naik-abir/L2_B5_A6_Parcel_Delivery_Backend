import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
};

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) =>{
  if(tokenInfo.accessToken){
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      // secure: envVars.NODE_ENV === "production",
      sameSite: "none",
      // maxAge: COOKIE_EXPRIRE_TIME
    })
  };
  
  if(tokenInfo.refreshToken){
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      // secure: envVars.NODE_ENV === "production",
      sameSite: "none"
    })
  };
};