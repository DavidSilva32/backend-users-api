import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatZodErrors } from "./zodUtils";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors";

// Agora é middleware de erro padrão do Express
export function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid data",
      fields: formatZodErrors(err.format()),
    });
  }

  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError
  ) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Email already registered" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
}
