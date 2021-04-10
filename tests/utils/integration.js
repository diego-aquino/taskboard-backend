import request from 'supertest';

import app from '~/app';

export async function registerMockAccount(options = {}) {
  const { email = 'account@example.com' } = options;

  const signUpResponse = await request(app).post('/accounts/signup').send({
    firstName: 'First',
    lastName: 'Last',
    email,
    password: '12345678',
  });

  const { account, accessToken, refreshToken } = signUpResponse.body;

  return {
    ...account,
    accessToken,
    refreshToken,
  };
}

export async function registerMockTask(mockAccount) {
  const taskCreationResponse = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${mockAccount.accessToken}`)
    .send({
      name: 'My task',
      priority: 'high',
    });

  const { task } = taskCreationResponse.body;

  return task;
}
