import { Response} from "express";

export function sendSuccess(
  res: Response,
  message: string = "Request completed successfully",
  data: any = null
) {
  return res.status(200).json({
    message,
    data,
  });
}