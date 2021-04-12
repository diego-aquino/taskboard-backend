import { Router } from 'express';

import { AccountsController, AuthMiddleware } from '~/controllers';

const accountsRoutes = Router();

accountsRoutes.post('/accounts/signup', AccountsController.signUp);
accountsRoutes.post('/accounts/login', AccountsController.login);
accountsRoutes.get(
  '/accounts/details',
  AuthMiddleware.authenticate,
  AccountsController.details,
);

export default accountsRoutes;
