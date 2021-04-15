import request from 'supertest';

import app from '~/app';
import config from '~/config';
import database from '~/database';
import {
  registerAccount,
  registerTask,
  withAuth,
} from '~tests/utils/integration';

const { listedTasksPerPage: tasksPerPage } = config.tasks;

function sortTasksByPriority(tasks, { ascending = true }) {
  const sortingFactor = ascending ? 1 : -1;
  const comparedTo = {
    high: { high: 0, low: 1 * sortingFactor },
    low: { high: -1 * sortingFactor, low: 0 },
  };

  return tasks.sort(
    (task, taskToCompare) => comparedTo[task.priority][taskToCompare.priority],
  );
}

function paginate(elements, elementsPerPage) {
  const pages = [];

  elements.forEach((element, index) => {
    const shouldBeOnANewPage = index % elementsPerPage === 0;
    if (shouldBeOnANewPage) {
      pages.push([]);
    }

    pages[pages.length - 1].push(element);
  });

  return pages;
}

function listTasks() {
  return withAuth(request(app).get(`/tasks`));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`GET /tasks` endpoint', () => {
  const account = {};
  const tasksPages = {
    unordered: [],
    ascending: [],
    descending: [],
    totalPages: 0,
  };

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

    Object.assign(tasksPages, {
      unordered: paginate(createdTasks, tasksPerPage),
      ascending: paginate(
        sortTasksByPriority(createdTasks, { ascending: true }),
        tasksPerPage,
      ),
      descending: paginate(
        sortTasksByPriority(createdTasks, { ascending: false }),
        tasksPerPage,
      ),
      totalPages: Math.ceil(createdTasks.length / tasksPerPage),
    });
  });

  it('should support listing tasks with pagination', async () => {
    const responses = await Promise.all([
      listTasks().auth(account.accessToken).query({ page: 1 }),
      listTasks().auth(account.accessToken).query({ page: 2 }),
      listTasks().auth(account.accessToken).query({ page: 3 }),
    ]);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    const [
      firstPageResponse,
      secondPageResponse,
      thirdPageResponse,
    ] = responses;

    [firstPageResponse, secondPageResponse].forEach((response, index) => {
      expect(response.body).toEqual({
        tasks: expect.arrayContaining(tasksPages.unordered[index]),
        page: index + 1,
        totalPages: tasksPages.totalPages,
      });
    });

    expect(thirdPageResponse.body).toEqual({
      tasks: [],
      page: 3,
      totalPages: tasksPages.totalPages,
    });
  });

  it('should paginate tasks to the first page if not specified', async () => {
    const response = await listTasks().auth(account.accessToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      tasks: expect.arrayContaining(tasksPages.unordered[0]),
      page: 1,
      totalPages: tasksPages.totalPages,
    });
  });

  it('should not list tasks is page is invalid', async () => {
    const errorResponses = await Promise.all([
      listTasks().auth(account.accessToken).query({ page: 0 }),
      listTasks().auth(account.accessToken).query({ page: -1 }),
      listTasks().auth(account.accessToken).query({ page: 'not-a-page' }),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid field(s).',
      });
    });
  });

  it('should support listing tasks ordered by priority', async () => {
    const orderedResponses = await Promise.all([
      listTasks()
        .auth(account.accessToken)
        .query({ sortByPriority: 'asc', page: 1 }),
      listTasks()
        .auth(account.accessToken)
        .query({ sortByPriority: 'asc', page: 2 }),
      listTasks()
        .auth(account.accessToken)
        .query({ sortByPriority: 'desc', page: 1 }),
      listTasks()
        .auth(account.accessToken)
        .query({ sortByPriority: 'desc', page: 2 }),
    ]);

    orderedResponses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    const ascendingResponses = orderedResponses.slice(0, 2);
    const descendingResponses = orderedResponses.slice(2);

    ascendingResponses.forEach((response, index) => {
      expect(response.body).toEqual({
        tasks: tasksPages.ascending[index],
        page: index + 1,
        totalPages: tasksPages.totalPages,
      });
    });

    descendingResponses.forEach((response, index) => {
      expect(response.body).toEqual({
        tasks: tasksPages.descending[index],
        page: index + 1,
        totalPages: tasksPages.totalPages,
      });
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
    expect(response.body).toEqual({
      tasks: [],
      page: 1,
      totalPages: 0,
    });
  });

  it('should not list tasks if the user is not authenticated', async () => {
    const response = await listTasks();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
