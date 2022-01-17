import { Response } from "express";
import { CallbackError } from "mongoose";

export default function responseHandler(
  res: Response,
  status: number,
  message_key: string,
  message_text: string,
  data?: any
) {
  return res
    .status(status)
    .send({ message: { key: message_key, text: message_text }, data });
}
export function responseHandlerError(res: Response, message: CallbackError) {
  return responseHandler(res, 500, "", JSON.stringify(message));
}
