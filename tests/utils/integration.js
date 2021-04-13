import request from 'supertest';

import app from '~/app';

export async function registerAccount(accountInfo = {}) {
  const {
    firstName = 'First',
    lastName = 'Last',
    email = 'account@example.com',
    password = '12345678',
  } = accountInfo;

  const signUpResponse = await request(app).post('/accounts/signup').send({
    firstName,
    lastName,
    email,
    password,
  });

  const { account, accessToken, refreshToken } = signUpResponse.body;

  return { ...account, accessToken, refreshToken };
}

export async function registerTask(account, taskInfo = {}) {
  const { name = 'My task', priority = 'high' } = taskInfo;

  const taskCreationResponse = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${account.accessToken}`)
    .send({ name, priority });

  const { task } = taskCreationResponse.body;

  return task;
}
