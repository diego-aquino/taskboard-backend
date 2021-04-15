import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Task } from '~/models';
import {
  registerAccount,
  registerTask,
  withAuth,
} from '~tests/utils/integration';

function getTask(taskId) {
  return withAuth(request(app).get(`/tasks/${taskId}`));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`GET /tasks/:taskId` endpoint', () => {
  const account = {};
  const task = {};

  beforeAll(async () => {
    const registeredAccount = await registerAccount({
      email: 'get.tasks@example.com',
    });
    Object.assign(account, registeredAccount);

    const registeredTask = await registerTask(account);
    Object.assign(task, registeredTask);
  });

  it('should return the details of an existing task', async () => {
    const response = await getTask(task.id).auth(account.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      task: {
        id: expect.any(String),
        name: task.name,
        priority: task.priority,
        owner: account.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('should not return details of a non-existing task', async () => {
    await Task.findByIdAndRemove(task.id);

    const response = await getTask(task.id).auth(account.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not return details of a task related to another account', async () => {
    const otherAccount = await registerAccount({
      email: 'other.get.tasks@example.com',
    });

    const response = await getTask(task.id).auth(otherAccount.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not return details of a task if the id is invalid', async () => {
    const response = await getTask('some-invalid-id').auth(account.accessToken);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid object id.' });
  });

  it('should not return details of a task if the user is not authenticated', async () => {
    const response = await getTask(task.id);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
