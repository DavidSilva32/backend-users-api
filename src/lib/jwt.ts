import jwt, { SignOptions } from "jsonwebtoken";
import { AuthTokenPayload } from "../types/auth";

const SECRET = process.env.JWT_SECRET || "your_default_secret";
const EXPIRATION_TIME = (process.env.JWT_EXPIRATION_TIME || "1h") as SignOptions["expiresIn"];


export const generateToken = (payload: AuthTokenPayload) => {
  const options: SignOptions = { expiresIn: EXPIRATION_TIME };

  return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, SECRET) as AuthTokenPayload;
};