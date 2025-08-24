import express, { Request, Response } from "express"
import cors from "cors";
import "./app/config/passport";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import { router } from "./app/routes/route";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/NotFound";
import cookieParser from "cookie-parser";

const app = express();

// middleware
app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(cookieParser())
app.use(express.json());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: envVars.FRONTEND_URL, 
  credentials: true,
}));


// router
app.use("/api/v1", router);

// server
app.get('/', (req: Request, res: Response) =>{
  res.status(200).json({
    message: "🚚 Welcome to Parcel Delivery System Backend"
  })
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;