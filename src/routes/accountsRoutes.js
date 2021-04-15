import { Router } from 'express';

import { AccountsController, AuthMiddleware } from '~/controllers';

const accountsRoutes = Router();

const authenticate = (...args) => AuthMiddleware.authenticate(...args);

accountsRoutes.post('/accounts/signup', AccountsController.signup);
accountsRoutes.post('/accounts/login', AccountsController.login);
accountsRoutes.post('/accounts/token', AccountsController.token);
accountsRoutes.post(
  '/accounts/logout',
  authenticate,
  AccountsController.logout,
);
accountsRoutes.get(
  '/accounts/details',
  authenticate,
  AccountsController.details,
);

export default accountsRoutes;
