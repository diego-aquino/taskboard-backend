import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Task } from '~/models';
import { registerAccount, registerTask } from '~tests/utils/integration';

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

  function removeTaskRequest(taskId, accessToken) {
    const ongoingRequest = request(app).delete(`/tasks/${taskId}`);

    return accessToken
      ? ongoingRequest.set('Authorization', `Bearer ${accessToken}`)
      : ongoingRequest;
  }

  it('should support removing existing tasks', async () => {
    const response = await removeTaskRequest(task.id, account.accessToken);

    expect(response.status).toBe(204);

    const removedTask = await Task.findById(task.id);
    expect(removedTask).toBe(null);
  });

  it('should not remove a non-existing task', async () => {
    await Task.findByIdAndRemove(task.id);

    const response = await removeTaskRequest(task.id, account.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not remove a task owned by another account', async () => {
    const otherAccount = await registerAccount({
      email: 'other.remove.tasks@example.com',
    });

    const response = await removeTaskRequest(task.id, otherAccount.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not remove a task if the user is not authenticated', async () => {
    const response = await removeTaskRequest();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
