import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account } from '~/models';
import { registerMockAccount } from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/logout` endpoint', () => {
  const account = {};

  beforeEach(async () => {
    await Account.deleteMany({});
    Object.assign(
      account,
      await registerMockAccount({ email: 'logout.accounts@example.com' }),
    );
  });

  function logoutAccountRequest(accessToken) {
    const ongoingRequest = request(app).post('/accounts/logout');

    return accessToken
      ? ongoingRequest.set('Authorization', `Bearer ${accessToken}`)
      : ongoingRequest;
  }

  it('should support logging out accounts', async () => {
    const response = await logoutAccountRequest(account.accessToken).send();

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

    const response = await logoutAccountRequest(account.accessToken).send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Account not found.' });
  });

  it('should not log out accounts if the user is not authenticated', async () => {
    const response = await logoutAccountRequest().send();

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing access token.',
    });
  });
});
