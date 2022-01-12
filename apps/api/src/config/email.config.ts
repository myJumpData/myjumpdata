import dotenv from 'dotenv';

dotenv.config();

export default {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PSWD: process.env.EMAIL_PSWD,
};
