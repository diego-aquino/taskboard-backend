import { Router } from 'express';

import accountsRoutes from './accountsRoutes';
import tasksRoutes from './tasksRoutes';
import docsRoutes from './docsRoutes';

const routes = Router();
routes.use(initializeRequestLocals);

routes.use(accountsRoutes);
routes.use(tasksRoutes);
routes.use(docsRoutes);

routes.use(handleUncaughtErrors);

function initializeRequestLocals(request, _response, next) {
  request.locals = {};
  next();
}

function handleUncaughtErrors(error, _request, response, _next) {
  response.status(500).json({ message: 'Internal server error.' });
  console.error(error);
}

export default routes;
