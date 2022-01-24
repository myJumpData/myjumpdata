import { API_PORT, CONNECT_STRING_DEFAULT } from "@myjumpdata/consts";
import mongoose from "mongoose";
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
