import { JwtPayload } from 'jsonwebtoken';

export interface AuthTokenPayload extends JwtPayload {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
  }  