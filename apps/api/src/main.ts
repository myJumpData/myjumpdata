import mongoose from "mongoose";
import { CONNECT_STRING_DEFAULT } from "./config/db.config";
import { API_PORT } from "./config/host.config";
import createServer from "./server";

mongoose
  .connect(CONNECT_STRING_DEFAULT)
  .then(() => {
    const app = createServer();
    app.listen(API_PORT, () => {
      console.log(`Listening on PORT ${API_PORT}`);
    });
  })
  .catch((e) => console.log(e));
