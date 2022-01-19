import mongoose from "mongoose";
import { CONNECT_STRING_DEFAULT } from "./config/db.config";
import createServer from "./server";

mongoose
  .connect(CONNECT_STRING_DEFAULT)
  .then(() => {
    const app = createServer();
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch((e) => console.log(e));
