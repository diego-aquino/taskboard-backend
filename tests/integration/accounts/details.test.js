import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account } from '~/models';
import { registerAccount, withAuth } from '~tests/utils/integration';

function details() {
  return withAuth(request(app).get('/accounts/details'));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/details` endpoint', () => {
  const account = {};

  beforeEach(async () => {
    const accountAlreadyExists = await Account.exists({ _id: account.id });
    if (accountAlreadyExists) return;

    const registeredAccount = await registerAccount({
      email: 'details.accounts@example.com',
    });
    Object.assign(account, registeredAccount);
  });

  it('should return the details of an existing account', async () => {
    const response = await details().auth(account.accessToken);

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
    await Account.deleteOne({ email: account.email });

    const response = await details().auth(account.accessToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Account not found.',
    });
  });

  it('should return an error if the access token is missing or invalid', async () => {
    const errorResponses = await Promise.all([
      details(),
      details().auth(''),
      details().auth('this-is-not-a-token'),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid or missing access token.',
      });
    });
  });
});
