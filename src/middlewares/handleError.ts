import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatZodErrors } from "../utils/zodUtils";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors";

export function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid data",
      fields: formatZodErrors(err.format()),
    });
  }

  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError
  ) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ message: "Email already registered" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(500).json({
    message: "Internal server error",
    details: err.message,
  });
}
