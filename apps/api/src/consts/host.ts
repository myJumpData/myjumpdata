import dotenv from "dotenv";

dotenv.config();

export const API_URL = process.env["API_URL"];
export const API_PORT = Number.isInteger(
  process.env["API_URL"]?.split(":").slice(-1)[0]
)
  ? process.env["API_URL"]?.split(":").slice(-1)[0]
  : 3333;

export const APP_URL = process.env["APP_URL"];
process.env["APP_URL"]?.split(":").slice(-1)[0];
