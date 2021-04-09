import * as yup from 'yup';

import Task from '~/models/Task';
import AccountsServices from '~/services/accounts';
import { AccountNotFoundError } from '~/services/accounts/errors';

class TasksServices {
  static async create(taskInfo, accountId) {
    const validatedTaskInfo = await TasksServices.#validateTaskInfo(taskInfo);

    const { name, priority } = validatedTaskInfo;

    const accountExists = await AccountsServices.existsWithId(accountId);
    if (!accountExists) {
      throw new AccountNotFoundError();
    }

    const createdTask = await Task.create({ name, priority, owner: accountId });
    return createdTask;
  }

  static #validateTaskInfo(taskInfo) {
    const taskInfoSchema = yup.object({
      name: yup.string().required(),
      priority: yup
        .string()
        .oneOf(['high', 'low'], 'Unknown priority.')
        .default('low'),
    });

    return taskInfoSchema.validate(taskInfo, {
      abortEarly: true,
      stripUnknown: true,
    });
  }
}

export default TasksServices;
