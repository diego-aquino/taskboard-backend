import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Task } from '~/models';
import {
  registerAccount,
  registerTask,
  withAuth,
} from '~tests/utils/integration';

function editTask(taskId) {
  return withAuth(request(app).put(`/tasks/${taskId}`));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`PUT /tasks/:taskId` endpoint', () => {
  const editFixture = {
    name: 'New task name',
    priority: 'low',
    isCompleted: true,
  };

  const account = {};
  const task = {};

  beforeAll(async () => {
    const registeredAccount = await registerAccount({
      email: 'edit.tasks@example.com',
    });
    Object.assign(account, registeredAccount);
  });

  beforeEach(async () => {
    await Task.deleteMany({ owner: account.id });

    const registeredTask = await registerTask(account);
    Object.assign(task, registeredTask);
  });

  it('should support editing an existing task', async () => {
    const response = await editTask(task.id)
      .auth(account.accessToken)
      .send(editFixture);

    expect(response.status).toBe(204);

    const editedTask = await Task.findById(task.id).lean();
    expect(editedTask).toEqual(
      expect.objectContaining({
        name: editFixture.name,
        priority: editFixture.priority,
        isCompleted: true,
      }),
    );
  });

  it('should support editing the name of a task without affecting other fields', async () => {
    const response = await editTask(task.id).auth(account.accessToken).send({
      name: editFixture.name,
    });

    expect(response.status).toBe(204);

    const taskWithEditedName = await Task.findById(task.id).lean();
    expect(taskWithEditedName).toEqual(
      expect.objectContaining({
        name: editFixture.name,
        priority: task.priority,
        isCompleted: task.isCompleted,
      }),
    );
  });

  it('should support editing the priority of a task without affecting other fields', async () => {
    const response = await editTask(task.id).auth(account.accessToken).send({
      priority: editFixture.priority,
    });

    expect(response.status).toBe(204);

    const taskWithEditedPriority = await Task.findById(task.id).lean();
    expect(taskWithEditedPriority).toEqual(
      expect.objectContaining({
        name: task.name,
        priority: editFixture.priority,
        isCompleted: task.isCompleted,
      }),
    );
  });

  it('should support editing the completion status of a task without affecting other fields', async () => {
    const response = await editTask(task.id).auth(account.accessToken).send({
      isCompleted: editFixture.isCompleted,
    });

    expect(response.status).toBe(204);

    const taskWithEditedPriority = await Task.findById(task.id).lean();
    expect(taskWithEditedPriority).toEqual(
      expect.objectContaining({
        name: task.name,
        priority: task.priority,
        isCompleted: editFixture.isCompleted,
      }),
    );
  });

  it('should not edit a non-existing task', async () => {
    await Task.findByIdAndRemove(task.id);

    const response = await editTask(task.id)
      .auth(account.accessToken)
      .send(editFixture);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not edit a task owned by another account', async () => {
    const otherAccount = await registerAccount({
      email: 'other.edit.tasks@example.com',
    });

    const response = await editTask(task.id)
      .auth(otherAccount.accessToken)
      .send(editFixture);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Task not found.' });
  });

  it('should not edit a task if any fields are empty', async () => {
    const errorResponses = await Promise.all([
      editTask(task.id).auth(account.accessToken).send({ name: '' }),
      editTask(task.id).auth(account.accessToken).send({ priority: '' }),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
    });

    const [emptyFieldsResponse, unknownPriorityResponse] = errorResponses;

    expect(emptyFieldsResponse.body).toEqual({ message: 'Invalid field(s).' });
    expect(unknownPriorityResponse.body).toEqual({
      message: 'Unknown priority.',
    });
  });

  it('should not edit a task if priority is unknown', async () => {
    const response = await editTask(task.id)
      .auth(account.accessToken)
      .send({
        ...editFixture,
        priority: 'some-unknown-priority',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Unknown priority.' });
  });

  it('should not edit a task if the id is invalid', async () => {
    const response = await editTask('some-invalid-id')
      .auth(account.accessToken)
      .send(editFixture);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid object id.' });
  });

  it('should not edit a task if the user is not authenticated', async () => {
    const response = await editTask(task.id).send(editFixture);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
