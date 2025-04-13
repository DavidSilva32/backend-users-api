import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret_key";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};