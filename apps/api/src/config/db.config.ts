import dotenv from "dotenv";

dotenv.config();

const ENV_DATA = {
  DB_USER: process.env.DB_USER,
  DB_PSWD: process.env.DB_PSWD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
};

if (ENV_DATA.DB_HOST === null || ENV_DATA.DB_HOST === "") {
  ENV_DATA.DB_HOST = "localhost";
}
if (ENV_DATA.DB_PORT === null || ENV_DATA.DB_PORT === "") {
  ENV_DATA.DB_PORT = "27017";
}

export const CONNECT_STRING_DEFAULT = `mongodb://${
  ENV_DATA.DB_USER &&
  ENV_DATA.DB_PSWD &&
  `${ENV_DATA.DB_USER}:${ENV_DATA.DB_PSWD}@`
}${ENV_DATA.DB_HOST}:${ENV_DATA.DB_PORT}/${ENV_DATA.DB_NAME}`;

export const CONNECT_STRING_TEST = `mongodb://${
  ENV_DATA.DB_USER &&
  ENV_DATA.DB_PSWD &&
  `${ENV_DATA.DB_USER}:${ENV_DATA.DB_PSWD}@`
}${ENV_DATA.DB_HOST}:${ENV_DATA.DB_PORT}/${ENV_DATA.DB_NAME}_test`;
