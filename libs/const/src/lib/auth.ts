import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env["JWT_SECRET"];
export const JWT_EXPIRATION = 86400; // 31 Days
export const JWT_REFRESH = 8035200; // 31 * 3 Days
