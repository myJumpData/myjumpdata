import createServer from './app/server';
import dbConfig from './app/config/db.config';
import mongoose from 'mongoose';

mongoose.connect(dbConfig.CONNECT_STRING).then(() => {
  const app = createServer();
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
