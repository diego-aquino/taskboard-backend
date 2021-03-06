import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account, Task } from '~/models';
import { registerAccount, withAuth } from '~tests/utils/integration';

function createTask() {
  return withAuth(request(app).post('/tasks'));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`POST /tasks` endpoint', () => {
  const fixture = { name: 'My task', priority: 'high' };
  const account = {};

  beforeEach(async () => {
    await Task.deleteMany({ owner: account.id });

    const accountAlreadyExists = await Account.exists({ _id: account.id });
    if (accountAlreadyExists) return;

    const registeredAccount = await registerAccount({
      email: 'create.tasks@example.com',
    });
    Object.assign(account, registeredAccount);
  });

  it('should support creating new tasks related to existing accounts', async () => {
    const response = await createTask().auth(account.accessToken).send(fixture);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      task: {
        id: expect.any(String),
        name: fixture.name,
        priority: fixture.priority,
        isCompleted: false,
        owner: account.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });

    const { task } = response.body;

    const createdTask = await Task.findById(task.id).lean();

    expect(createdTask).toEqual(
      expect.objectContaining({
        name: task.name,
        priority: task.priority,
        isCompleted: false,
      }),
    );
    expect(createdTask._id.toString()).toBe(task.id);
    expect(createdTask.owner.toString()).toBe(account.id);
    expect(createdTask.createdAt.toISOString()).toBe(task.createdAt);
    expect(createdTask.updatedAt.toISOString()).toBe(task.updatedAt);
  });

  it('should not create a task related to a non-existing account', async () => {
    await Account.findByIdAndDelete(account.id);

    const response = await createTask().auth(account.accessToken).send(fixture);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Account not found.' });
  });

  it('should not create a task if priority is unknown', async () => {
    const response = await createTask()
      .auth(account.accessToken)
      .send({
        ...fixture,
        priority: 'some-unknown-priority',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Unknown priority.' });
  });

  it('should create a task with default priority if it was not specified', async () => {
    const response = await createTask()
      .auth(account.accessToken)
      .send({
        ...fixture,
        priority: undefined,
      });

    const defaultPriority = 'low';

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      task: expect.objectContaining({
        priority: defaultPriority,
      }),
    });
  });

  it('should not create a task if any required fields are empty or missing', async () => {
    const errorResponses = await Promise.all([
      createTask().auth(account.accessToken).send({ name: '' }),
      createTask().auth(account.accessToken).send({}),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid or missing required field(s).',
      });
    });
  });

  it('should not create a task if the user is not authenticated', async () => {
    const response = await createTask().send(fixture);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
