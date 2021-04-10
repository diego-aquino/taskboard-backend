import { ValidationError } from 'yup';

import { AccountNotFoundError } from '~/services/accounts/errors';
import TasksServices from '~/services/tasks';
import TasksViews from '~/views/TasksViews';

class TasksController {
  static async create(request, response, next) {
    try {
      const { accountId } = request.locals;
      const { name, priority } = request.body;

      const taskInfo = { name, priority };
      const createdTask = await TasksServices.create(taskInfo, accountId);

      const taskView = TasksViews.render(createdTask.toObject());

      return response.status(201).json({ task: taskView });
    } catch (error) {
      return TasksController.#handleError(error, { response, next });
    }
  }

  static #handleError(error, { response, next }) {
    const { message } = error;

    if (error instanceof AccountNotFoundError) {
      return response.status(404).json({ message });
    }

    if (error instanceof ValidationError) {
      return response.status(400).json({ message });
    }

    return next(error);
  }
}

export default TasksController;
