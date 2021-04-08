import { Router } from 'express';

import { AccountsController } from '~/controllers';

const accountsRoutes = Router();

accountsRoutes.post('/accounts/signup', AccountsController.signUp);

export default accountsRoutes;
