import request from 'supertest';

import app from '~/app';
import database from '~/database';
import Account from '~/models/Account';

async function registerFixtureAccount() {
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

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/details` endpoint', () => {
  beforeEach(async () => Account.deleteMany({}));

  it('should return the details of an existing account', async () => {
    const account = await registerFixtureAccount();

    const response = await request(app)
      .get('/accounts/details')
      .set('Authorization', `Bearer ${account.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      account: {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
      },
    });
  });

  it('should not return details of a non-existing account', async () => {
    const account = await registerFixtureAccount();
    await Account.deleteOne({ email: account.email });

    const response = await request(app)
      .get('/accounts/details')
      .set('Authorization', `Bearer ${account.accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Account not found.',
    });
  });

  it('should return an error if the access token is missing or invalid', async () => {
    const errorResponses = await Promise.all([
      request(app).get('/accounts/details'),
      request(app).get('/accounts/details').set('Authorization', 'Bearer'),
      request(app)
        .get('/accounts/details')
        .set('Authorization', 'Bearer this-is-not-a-token'),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid or missing access token.',
      });
    });
  });
});