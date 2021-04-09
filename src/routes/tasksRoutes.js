import { Router } from 'express';

import { TasksController, AuthMiddleware } from '~/controllers';

const tasksRoutes = Router();

tasksRoutes.post('/tasks', AuthMiddleware.authenticate, TasksController.create);

export default tasksRoutes;
