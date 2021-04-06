import { Router } from 'express';

const routes = Router();

routes.get('/hello', (_, response) =>
  response.json({ message: 'Hello world!' }),
);

export default routes;
