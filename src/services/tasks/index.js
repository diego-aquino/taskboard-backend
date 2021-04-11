import mongoose from 'mongoose';
import * as yup from 'yup';

import { Task } from '~/models';
import AccountsServices from '~/services/accounts';
import { AccountNotFoundError } from '~/services/accounts/errors';

const taskPriorityOrders = {
  asc: ['low', 'high'],
  desc: ['high', 'low'],
};

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

  static findById(taskId, options = {}) {
    const { owner } = options;
    const filters = { _id: taskId, owner };

    if (owner === undefined) {
      delete filters.owner;
    }

    return Task.findOne(filters);
  }

  static findByOwner(owner, options = {}) {
    const { sortByPriority } = options;
    const prioritySortingOrder = taskPriorityOrders[sortByPriority];

    if (!prioritySortingOrder) {
      return Task.find({ owner });
    }

    const ownerObjectId = mongoose.Types.ObjectId(owner);
    return Task.aggregate()
      .match({ owner: ownerObjectId })
      .addFields({
        __order: { $indexOfArray: [prioritySortingOrder, '$priority'] },
      })
      .sort({ __order: 1 });
  }
}

export default TasksServices;
