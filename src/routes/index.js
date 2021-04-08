import { Router } from 'express';

import accountsRoutes from './accountsRoutes';

const routes = Router();

routes.use(accountsRoutes);

export default routes;
