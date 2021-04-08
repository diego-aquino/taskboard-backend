import { Router } from 'express';

import accountsRoutes from './accountsRoutes';

const routes = Router();

routes.use(initializeRequestLocals);
routes.use(accountsRoutes);

function initializeRequestLocals(request, response, next) {
  request.locals = {};
  next();
}

export default routes;
