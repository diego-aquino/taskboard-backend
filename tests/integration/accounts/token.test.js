import request from 'supertest';

import app from '~/app';
import config from '~/config';
import database from '~/database';
import { Account } from '~/models';
import { verifyToken } from '~/utils/jwt';
import { registerAccount } from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/token` endpoint', () => {
  const account = {};

  beforeEach(async () => {
    await Account.deleteMany({});
    Object.assign(
      account,
      await registerAccount({ email: 'token.accounts@example.com' }),
    );
  });

  it('should support generating new access tokens to logged in accounts', async () => {
    const response = await request(app).post('/accounts/token').send({
      refreshToken: account.refreshToken,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });

    const { accessToken } = response.body;
    const { accessSecretKey } = config.jwt;
    const { accountId } = await verifyToken(accessToken, accessSecretKey);

    expect(accountId).toBe(account.id);
  });

  it('should not generate new access tokens to non-existing accounts', async () => {
    await Account.findByIdAndDelete(account.id);

    const response = await request(app).post('/accounts/token').send({
      refreshToken: account.refreshToken,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Account not found.',
    });
  });

  it('should not generate new access tokens to accounts that are not logged in', async () => {
    await request(app)
      .post('/accounts/logout')
      .set('Authorization', `Bearer ${account.accessToken}`)
      .send();

    const response = await request(app).post('/accounts/token').send({
      refreshToken: account.refreshToken,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing refresh token.',
    });
  });

  it('should not generate new access tokens to if refresh token is missing or invalid', async () => {
    const errorResponses = await Promise.all([
      request(app).post('/accounts/token').send({}),
      request(app).post('/accounts/token').send({
        refreshToken: 'this-is-not-a-refresh-token',
      }),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid or missing refresh token.',
      });
    });
  });
});
