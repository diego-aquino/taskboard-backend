import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account } from '~/models';
import { registerAccount, withAuth } from '~tests/utils/integration';

function logout() {
  return withAuth(request(app).post('/accounts/logout'));
}

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/logout` endpoint', () => {
  const account = {};

  beforeEach(async () => {
    const accountAlreadyExists = await Account.exists({ _id: account.id });
    if (accountAlreadyExists) return;

    const registeredAccount = await registerAccount({
      email: 'logout.accounts@example.com',
    });
    Object.assign(account, registeredAccount);
  });

  it('should support logging out accounts', async () => {
    const response = await logout().auth(account.accessToken).send();

    expect(response.status).toBe(204);

    const loggedOutAccount = await Account.findById(account.id).lean();
    expect(loggedOutAccount).toEqual(
      expect.objectContaining({
        auth: expect.objectContaining({
          activeRefreshToken: null,
        }),
      }),
    );
  });

  it('should not log out non-existing accounts', async () => {
    await Account.findByIdAndDelete(account.id);

    const response = await logout().auth(account.accessToken).send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Account not found.' });
  });

  it('should not log out accounts if the user is not authenticated', async () => {
    const response = await logout().send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
