import request from 'supertest';

import app from '~/app';
import database from '~/database';
import {
  registerAccount,
  registerTask,
  withAuth,
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

function listTasks() {
  return withAuth(request(app).get(`/tasks`));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`GET /tasks` endpoint', () => {
  const account = {};
  const tasks = [];

  beforeAll(async () => {
    const registeredAccount = await registerAccount({
      email: 'list.tasks@example.com',
    });
    Object.assign(account, registeredAccount);

    const createdTasks = await Promise.all([
      registerTask(account, { name: '1st task', priority: 'high' }),
      registerTask(account, { name: '2nd task', priority: 'low' }),
      registerTask(account, { name: '3rd task', priority: undefined }),
      registerTask(account, { name: '4th task', priority: 'low' }),
      registerTask(account, { name: '5th task', priority: 'high' }),
    ]);
    createdTasks.forEach((task) => tasks.push(task));
  });

  it('should list all tasks related to an account', async () => {
    const response = await listTasks().auth(account.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tasks: expect.arrayContaining(tasks),
    });
  });

  it('should support listing tasks ordered by priority', async () => {
    const orderedResponses = await Promise.all([
      listTasks().auth(account.accessToken).query({ sortByPriority: 'asc' }),
      listTasks().auth(account.accessToken).query({ sortByPriority: 'desc' }),
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
    const response = await listTasks().auth(account.accessToken).query({
      sortByPriority: 'not-a-valid-order',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid sorting order.' });
  });

  it('should not list tasks related to other accounts', async () => {
    const otherAccount = await registerAccount({
      email: 'other.list.tasks@example.com',
    });

    const response = await listTasks().auth(otherAccount.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ tasks: [] });
  });

  it('should not list tasks if the user is not authenticated', async () => {
    const response = await listTasks();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
