import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Task } from '~/models';
import {
  registerMockAccount,
  registerMockTask,
} from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`GET /tasks/:taskId` endpoint', () => {
  const task = {};
  const account = {};

  function getTaskRequest(taskId, accessToken) {
    const ongoingRequest = request(app).get(`/tasks/${taskId}`);

    return accessToken
      ? ongoingRequest.set('Authorization', `Bearer ${accessToken}`)
      : ongoingRequest;
  }

  beforeAll(async () => {
    Object.assign(account, await registerMockAccount());
    Object.assign(task, await registerMockTask(account));
  });

  it('should return the details of an existing task', async () => {
    const response = await getTaskRequest(task.id, account.accessToken);

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

    const response = await getTaskRequest(task.id, account.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not return details of a task related to another account', async () => {
    const otherAccount = await registerMockAccount({
      email: 'otheraccount@example.com',
    });

    const response = await getTaskRequest(task.id, otherAccount.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not return details of a task if the user is not authenticated', async () => {
    const response = await getTaskRequest(task.id);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
