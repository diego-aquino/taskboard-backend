import { Router } from 'express';

import { TasksController, AuthMiddleware } from '~/controllers';

const tasksRoutes = Router();

const authenticate = (...args) => AuthMiddleware.authenticate(...args);

tasksRoutes.post('/tasks', authenticate, TasksController.create);
tasksRoutes.get('/tasks', authenticate, TasksController.list);
tasksRoutes.get('/tasks/:taskId', authenticate, TasksController.get);
tasksRoutes.put('/tasks/:taskId', authenticate, TasksController.update);
tasksRoutes.delete('/tasks/:taskId', authenticate, TasksController.remove);

export default tasksRoutes;
