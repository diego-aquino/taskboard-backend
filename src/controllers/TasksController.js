import * as yup from 'yup';

import AccountsServices from '~/services/accounts';
import { AccountNotFoundError } from '~/services/accounts/errors';
import TasksServices from '~/services/tasks';
import { TaskNotFoundError } from '~/services/tasks/errors';
import { TasksViews } from '~/views';
import { InvalidObjectId } from '~/validators/errors';
import { isValidObjectId } from '~/utils/mongodb';

const { ValidationError } = yup;

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

  static async get(request, response, next) {
    try {
      const { accountId } = request.locals;
      const { taskId } = request.params;

      if (!isValidObjectId(taskId)) {
        throw new InvalidObjectId();
      }

      const accountExists = await AccountsServices.existsWithId(accountId);
      if (!accountExists) {
        throw new AccountNotFoundError();
      }

      const task = await TasksServices.findById(taskId, {
        owner: accountId,
      }).lean();

      if (!task) {
        throw new TaskNotFoundError();
      }

      const taskView = TasksViews.render(task);

      return response.status(200).json({ task: taskView });
    } catch (error) {
      return TasksController.#handleError(error, { response, next });
    }
  }

  static async list(request, response, next) {
    try {
      const { accountId } = request.locals;
      const { page, sortByPriority } = await TasksController.#validateListQuery(
        request.query,
      );

      const accountExists = await AccountsServices.existsWithId(accountId);
      if (!accountExists) {
        throw new AccountNotFoundError();
      }

      const { tasks, totalPages } = await TasksServices.findByOwner(accountId, {
        page,
        sortByPriority,
      });
      const taskViews = TasksViews.renderMany(tasks);

      return response.status(200).json({ tasks: taskViews, page, totalPages });
    } catch (error) {
      return TasksController.#handleError(error, { response, next });
    }
  }

  static #validateListQuery(requestQuery) {
    const requestQuerySchema = yup.object({
      page: yup.number().integer().min(1, 'Invalid field(s).').default(1),
      sortByPriority: yup
        .string()
        .oneOf(['asc', 'desc', undefined], 'Invalid sorting order.'),
    });

    return requestQuerySchema.validate(requestQuery, {
      abortEarly: true,
      stripUnknown: true,
    });
  }

  static async update(request, response, next) {
    try {
      const { accountId } = request.locals;
      const { taskId } = request.params;
      const update = request.body;

      if (!isValidObjectId(taskId)) {
        throw new InvalidObjectId();
      }

      const accountExists = await AccountsServices.existsWithId(accountId);
      if (!accountExists) {
        throw new AccountNotFoundError();
      }

      const taskExists = await TasksServices.existsWithId(taskId, {
        owner: accountId,
      });
      if (!taskExists) {
        throw new TaskNotFoundError();
      }

      await TasksServices.updateById(taskId, update, { owner: accountId });

      return response.status(204).send();
    } catch (error) {
      return TasksController.#handleError(error, { response, next });
    }
  }

  static async remove(request, response, next) {
    try {
      const { accountId } = request.locals;
      const { taskId } = request.params;

      if (!isValidObjectId(taskId)) {
        throw new InvalidObjectId();
      }

      const accountExists = await AccountsServices.existsWithId(accountId);
      if (!accountExists) {
        throw new AccountNotFoundError();
      }

      const taskExists = await TasksServices.existsWithId(taskId, {
        owner: accountId,
      });
      if (!taskExists) {
        throw new TaskNotFoundError();
      }

      await TasksServices.removeById(taskId);

      return response.status(204).send();
    } catch (error) {
      return TasksController.#handleError(error, { response, next });
    }
  }

  static #handleError(error, { response, next }) {
    const { message } = error;

    if (error instanceof AccountNotFoundError) {
      return response.status(404).json({ message });
    }

    if (error instanceof TaskNotFoundError) {
      return response.status(404).json({ message });
    }

    if (error instanceof ValidationError) {
      return response.status(400).json({ message });
    }

    return next(error);
  }
}

export default TasksController;
