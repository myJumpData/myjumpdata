import mongoose from "mongoose";
import { CONNECT_STRING_DEFAULT, ENV_DATA } from "./consts/db";
import { API_PORT } from "./consts/host";
import createServer from "./server";

mongoose
  .connect(CONNECT_STRING_DEFAULT, {
    user: ENV_DATA.DB_USER,
    pass: ENV_DATA.DB_PSWD,
    dbName: ENV_DATA.DB_NAME,
  })
  .then(() => {
    const { app, io } = createServer();
    io.listen(3000);
    app.listen(API_PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on PORT ${API_PORT}`);
    });
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
  });
