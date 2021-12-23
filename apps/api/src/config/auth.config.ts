import dotenv from 'dotenv';

dotenv.config()

export default {
  secret: process.env.JWT_SECRET,
  jwtExpiration: 86400, // 31 Days
  jwtRefreshExpiration: 8035200, // 31 * 3 Days

  /* for test */
  //jwtExpiration: 30,
  //jwtRefreshExpiration: 60,
};
