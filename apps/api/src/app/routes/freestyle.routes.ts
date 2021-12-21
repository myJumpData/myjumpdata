import { Express } from 'express-serve-static-core';
import { getFreestyle } from '../controllers/freestyle.controller';

export default function FreestyleRoutes(app: Express) {
  app.get('/freestyle:path(*)', getFreestyle);
}
