import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// ...

export interface CustomJwtPayload extends JwtPayload {
  _id?: string;
  role: string;
  email: string;
}


export interface AuthRequest extends Request {
  user?: CustomJwtPayload; 
}