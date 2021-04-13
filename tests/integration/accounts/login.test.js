import request from 'supertest';

import app from '~/app';
import config from '~/config';
import database from '~/database';
import { Account } from '~/models';
import { verifyToken } from '~/utils/jwt';
import { registerAccount } from '~tests/utils/integration';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/login` endpoint', () => {
  const account = {
    password: '12345678',
  };

  beforeEach(async () => {
    await Account.deleteMany({});
    Object.assign(
      account,
      await registerAccount({
        email: 'login.accounts@example.com',
        password: account.password,
      }),
    );
  });

  it('should support logging in accounts', async () => {
    const response = await request(app).post('/accounts/login').send({
      email: account.email,
      password: account.password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const { refreshToken } = response.body;
    const { refreshSecretKey } = config.jwt;
    const { accountId } = await verifyToken(refreshToken, refreshSecretKey);

    expect(accountId).toBe(account.id);

    const loggedInAccount = await Account.findOne({ email: account.email });
    expect(loggedInAccount).toEqual(
      expect.objectContaining({
        auth: expect.objectContaining({
          activeRefreshToken: refreshToken,
        }),
      }),
    );
  });

  it('should not log in if email and password do not match', async () => {
    const response = await request(app).post('/accounts/login').send({
      email: account.email,
      password: 'some-different-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Email and/or password do not match.',
    });
  });

  it('should not log in if any required fields are invalid or missing', async () => {
    const errorResponses = await Promise.all([
      request(app).post('/accounts/login').send({ email: '', password: '' }),
      request(app).post('/accounts/login').send({}),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid or missing required field(s).',
      });
    });
  });

  it('should not log in non-existing accounts', async () => {
    await Account.findByIdAndDelete(account.id);

    const response = await request(app).post('/accounts/login').send({
      email: account.email,
      password: account.password,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Email and/or password do not match.',
    });
  });
});
