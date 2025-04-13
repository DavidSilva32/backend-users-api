import { Response } from "express";
import { ZodError } from "zod";
import { formatZodErrors } from "./zodUtils";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors";

export function handleError(res: Response, error: any) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      fields: formatZodErrors(error.format()),
    });
  }

  if (
    error instanceof BadRequestError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error.code === "P2002") {
    return res.status(409).json({ error: "Email já cadastrado" });
  }

  if (error.code === "P2025") {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.status(500).json({
    error: "Erro interno no servidor",
    details: error.message,
  });
}
