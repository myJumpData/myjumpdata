import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env["JWT_SECRET"];
export const JWT_EXPIRATION = 30758400; // 356 Days
