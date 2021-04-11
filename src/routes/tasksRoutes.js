import { Router } from 'express';

import { TasksController, AuthMiddleware } from '~/controllers';

const tasksRoutes = Router();

tasksRoutes.post('/tasks', AuthMiddleware.authenticate, TasksController.create);
tasksRoutes.get('/tasks', AuthMiddleware.authenticate, TasksController.list);
tasksRoutes.get(
  '/tasks/:taskId',
  AuthMiddleware.authenticate,
  TasksController.get,
);

export default tasksRoutes;
