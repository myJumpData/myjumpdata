import mongoose from 'mongoose';
import dbConfig from './config/db.config';
import createServer from './server';

mongoose.connect(dbConfig.CONNECT_STRING_prod).then(() => {
  const app = createServer();
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
}).catch((e)=>console.log(e));
