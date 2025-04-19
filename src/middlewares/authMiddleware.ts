import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/lib/jwt";
import { UnauthorizedError, ForbiddenError } from "../errors/customErrors";

type Role = "USER" | "ADMIN"
export const authMiddleware = (requiredRoles?: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Token not provided"));
      }

      const token = authHeader.split(" ")[1];

      const decoded = verifyToken(token);
      req.user = decoded;

      if (requiredRoles) {
        const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
        if (!rolesArray.includes(req.user.role)) {
          return next(
            new ForbiddenError("You do not have permission to access this resource")
          );
        }
      }

      next();
    } catch (error) {
      return next(new UnauthorizedError("Invalid token"));
    }
  };
};
