import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Task } from '~/models';
import {
  registerAccount,
  registerTask,
  withAuth,
} from '~tests/utils/integration';

function removeTask(taskId) {
  return withAuth(request(app).delete(`/tasks/${taskId}`));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`DELETE /tasks/:taskId` endpoint', () => {
  const account = {};
  const task = {};

  beforeAll(async () => {
    const registeredAccount = await registerAccount({
      email: 'remove.tasks@example.com',
    });
    Object.assign(account, registeredAccount);
  });

  beforeEach(async () => {
    await Task.deleteMany({ owner: account.id });

    const registeredTask = await registerTask(account);
    Object.assign(task, registeredTask);
  });

  it('should support removing existing tasks', async () => {
    const response = await removeTask(task.id).auth(account.accessToken);

    expect(response.status).toBe(204);

    const removedTask = await Task.findById(task.id);
    expect(removedTask).toBe(null);
  });

  it('should not remove a non-existing task', async () => {
    await Task.findByIdAndRemove(task.id);

    const response = await removeTask(task.id).auth(account.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not remove a task owned by another account', async () => {
    const otherAccount = await registerAccount({
      email: 'other.remove.tasks@example.com',
    });

    const response = await removeTask(task.id).auth(otherAccount.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not remove a task if the id is invalid', async () => {
    const response = await removeTask('some-invalid-id').auth(
      account.accessToken,
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid object id.' });
  });

  it('should not remove a task if the user is not authenticated', async () => {
    const response = await removeTask();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
