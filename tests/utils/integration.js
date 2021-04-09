import request from 'supertest';

import app from '~/app';

export async function registerFixtureAccount() {
  const signUpResponse = await request(app).post('/accounts/signup').send({
    firstName: 'First',
    lastName: 'Last',
    email: 'account@example.com',
    password: '12345678',
  });

  const { account, accessToken, refreshToken } = signUpResponse.body;

  return {
    ...account,
    accessToken,
    refreshToken,
  };
}
