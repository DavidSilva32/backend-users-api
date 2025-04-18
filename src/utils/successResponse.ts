import { Response} from "express";

export function sendSuccess<T>(
  res: Response,
  message: string = "Request completed successfully",
  data: T | null = null
) {
  return res.status(200).json({
    message,
    data,
  });
}