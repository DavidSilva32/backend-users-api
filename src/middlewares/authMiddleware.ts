import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/lib/jwt";
import { UnauthorizedError, ForbiddenError } from "../errors/customErrors";
import { AuthTokenPayload } from "../types/auth";

// Middleware para autenticação e verificação de roles
export const authMiddleware = (requiredRole?: "USER" | "ADMIN") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Token not provided"));
      }

      const token = authHeader.split(" ")[1];

      const decoded = verifyToken(token);
      req.user = decoded;

      // Verificando o role se necessário
      if (requiredRole && req.user.role !== requiredRole) {
        return next(
          new ForbiddenError(
            "You do not have permission to access this resource"
          )
        );
      }

      next();
    } catch (error) {
      return next(new UnauthorizedError("Invalid token"));
    }
  };
};
