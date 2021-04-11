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

describe('`DELETE /tasks/:taskId` endpoint', () => {
  const task = {};
  const account = {};

  beforeAll(async () => {
    Object.assign(
      account,
      await registerMockAccount({ email: 'remove.tasks@example.com' }),
    );
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    Object.assign(task, await registerMockTask(account));
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

  it('should not remove a task if the user is not authenticated', async () => {
    const response = await removeTaskRequest();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
