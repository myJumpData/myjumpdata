import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/user.routes';
import UsersRoutes from './routes/users.routes';
import ScoredataRoutes from './routes/scoredata.routes';
import GroupsRoutes from './routes/groups.routes';
import * as fs from 'fs';

export default function createServer() {
  const app = express();
  let app_url = 'https://myjumpdata.fediv.me';
  if (process.env.NODE_ENV === 'development') {
    app_url = 'https://localhost:4200';
  }
  app.use(
    cors({
      origin: app_url,
    })
  );
  app.use(express.json());
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  UserRoutes(app);
  UsersRoutes(app);
  ScoredataRoutes(app);
  GroupsRoutes(app);
  app.get('/locales/:lng/:ns', (req, res) => {
    const lng = req.params.lng;
    const ns = req.params.ns;
    fs.readFile(
      './apps/api/src/app/locales/' + lng + '/' + ns + '.json',
      (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(data);
      }
    );
  });
  return app;
}
