import { Router } from 'express';

import { AccountsController, AuthMiddleware } from '~/controllers';

const accountsRoutes = Router();

accountsRoutes.post('/accounts/signup', AccountsController.signUp);
accountsRoutes.get(
  '/accounts/details',
  AuthMiddleware.authenticate,
  AccountsController.details,
);

export default accountsRoutes;
