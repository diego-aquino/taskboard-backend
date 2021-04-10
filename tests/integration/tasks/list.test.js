import request from 'supertest';

import app from '~/app';
import database from '~/database';
import {
  registerMockAccount,
  registerMockTask,
} from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`GET /tasks` endpoint', () => {
  const tasks = [];
  const account = {};

  beforeAll(async () => {
    Object.assign(
      account,
      await registerMockAccount({ email: 'list.tasks@example.com' }),
    );

    const createdTasks = await Promise.all([
      registerMockTask(account, { name: '1st task', priority: 'high' }),
      registerMockTask(account, { name: '2nd task', priority: 'low' }),
      registerMockTask(account, { name: '3rd task', priority: undefined }),
      registerMockTask(account, { name: '4th task', priority: 'low' }),
      registerMockTask(account, { name: '5th task', priority: 'high' }),
    ]);
    createdTasks.forEach((task) => tasks.push(task));
  });

  function listTasksRequest(accessToken) {
    const ongoingRequest = request(app).get(`/tasks`);

    return accessToken
      ? ongoingRequest.set('Authorization', `Bearer ${accessToken}`)
      : ongoingRequest;
  }

  it('should list all tasks related to an account', async () => {
    const response = await listTasksRequest(account.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tasks: expect.arrayContaining(tasks),
    });
  });

  it('should not list tasks related to other accounts', async () => {
    const otherAccount = await registerMockAccount({
      email: 'other.list.tasks@example.com',
    });

    const response = await listTasksRequest(otherAccount.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ tasks: [] });
  });

  it('should not list tasks if the user is not authenticated', async () => {
    const response = await listTasksRequest();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
