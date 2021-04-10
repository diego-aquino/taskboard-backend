import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account, Task } from '~/models';
import { registerMockAccount } from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`POST /tasks` endpoint', () => {
  const fixture = {
    name: 'My task',
    priority: 'high',
  };
  const account = {};

  function createTaskRequest(options = {}) {
    const { authenticated = true } = options;

    const ongoingRequest = request(app).post('/tasks');

    return authenticated
      ? ongoingRequest.set('Authorization', `Bearer ${account.accessToken}`)
      : ongoingRequest;
  }

  beforeEach(async () => {
    await Promise.all([Task.deleteMany({}), Account.deleteMany({})]);
    Object.assign(account, await registerMockAccount());
  });

  it('should support creating new tasks related to existing accounts', async () => {
    const response = await createTaskRequest().send(fixture);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      task: {
        id: expect.any(String),
        name: fixture.name,
        priority: fixture.priority,
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
      }),
    );
    expect(createdTask._id.toString()).toBe(task.id);
    expect(createdTask.owner.toString()).toBe(account.id);
    expect(createdTask.createdAt.toISOString()).toBe(task.createdAt);
    expect(createdTask.updatedAt.toISOString()).toBe(task.updatedAt);
  });

  it('should not create a task related to a non-existing account', async () => {
    await Account.findByIdAndDelete(account.id);

    const response = await createTaskRequest().send(fixture);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Account not found.' });
  });

  it('should not create a task if priority is unknown', async () => {
    const response = await createTaskRequest().send({
      ...fixture,
      priority: 'some-unknown-priority',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Unknown priority.' });
  });

  it('should create a task with default priority if it was not specified', async () => {
    const response = await createTaskRequest().send({
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
      createTaskRequest().send({ name: '' }),
      createTaskRequest().send({}),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid or missing required field(s).',
      });
    });
  });

  it('should not create a task if the user is not authenticated', async () => {
    const response = await createTaskRequest({ authenticated: false }).send(
      fixture,
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
