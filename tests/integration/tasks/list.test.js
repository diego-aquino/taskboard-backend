import request from 'supertest';

import app from '~/app';
import database from '~/database';
import {
  registerMockAccount,
  registerMockTask,
} from '~tests/utils/integration';

function tasksSortedByPriority(tasks, { ascending = true }) {
  const sortingFactor = ascending ? 1 : -1;
  const comparedTo = {
    high: { high: 0, low: 1 * sortingFactor },
    low: { high: -1 * sortingFactor, low: 0 },
  };

  return tasks.sort(
    (task, taskToCompare) => comparedTo[task.priority][taskToCompare.priority],
  );
}

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

  it('should support listing tasks ordered by priority', async () => {
    const orderedResponses = await Promise.all([
      listTasksRequest(account.accessToken).query({ sortByPriority: 'asc' }),
      listTasksRequest(account.accessToken).query({ sortByPriority: 'desc' }),
    ]);

    orderedResponses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    const [ascendingResponse, descendingResponse] = orderedResponses;

    expect(ascendingResponse.body).toEqual({
      tasks: tasksSortedByPriority(tasks, { ascending: true }),
    });
    expect(descendingResponse.body).toEqual({
      tasks: tasksSortedByPriority(tasks, { ascending: false }),
    });
  });

  it('should not list tasks if the sorting order is invalid', async () => {
    const response = await listTasksRequest(account.accessToken).query({
      sortByPriority: 'not-a-valid-order',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid sorting order.' });
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