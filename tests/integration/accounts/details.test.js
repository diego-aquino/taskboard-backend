import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account } from '~/models';
import { registerMockAccount } from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/details` endpoint', () => {
  beforeEach(async () => Account.deleteMany({}));

  it('should return the details of an existing account', async () => {
    const account = await registerMockAccount();

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
    const account = await registerMockAccount();
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
