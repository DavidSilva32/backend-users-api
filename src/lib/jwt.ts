import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../types/auth";

const SECRET = process.env.JWT_SECRET || "secret_key";

export const generateToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, SECRET) as AuthTokenPayload;
};