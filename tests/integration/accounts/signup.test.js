import request from 'supertest';

import app from '~/app';
import config from '~/config';
import database from '~/database';
import { Account } from '~/models';
import { verifyToken } from '~/utils/jwt';

beforeAll(database.connect);
afterAll(database.disconnect);

function signup() {
  return request(app).post('/accounts/signup');
}

describe('`/accounts/signup` endpoint', () => {
  const fixture = {
    firstName: 'First',
    lastName: 'Last',
    email: 'signup.account@example.com',
    password: '12345678',
  };

  beforeEach(async () => {
    await Account.findOneAndDelete({ email: fixture.email });
  });

  it('should support creating new accounts', async () => {
    const response = await signup().send(fixture);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      account: {
        id: expect.any(String),
        firstName: fixture.firstName,
        lastName: fixture.lastName,
        email: fixture.email,
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const accountId = response.body.account.id;

    async function verifyStoredAccount() {
      const createdAccount = await Account.findOne({ email: fixture.email })
        .select('+password')
        .lean();

      expect(createdAccount._id.toString()).toBe(accountId);
      expect(createdAccount).toEqual(
        expect.objectContaining({
          firstName: fixture.firstName,
          lastName: fixture.lastName,
          email: fixture.email,
          password: expect.any(String),
        }),
      );
    }

    async function verifyAuthCredentials() {
      const { accessToken, refreshToken } = response.body;
      const { accessSecretKey, refreshSecretKey } = config.jwt;

      const [accessPayload, refreshPayload] = await Promise.all([
        verifyToken(accessToken, accessSecretKey),
        verifyToken(refreshToken, refreshSecretKey),
      ]);

      expect(accessPayload).toEqual(expect.objectContaining({ accountId }));
      expect(refreshPayload).toEqual(expect.objectContaining({ accountId }));
    }

    await Promise.all([verifyStoredAccount(), verifyAuthCredentials()]);
  });

  it('should not create an account if email already exists', async () => {
    const response = await signup().send(fixture);
    expect(response.status).toBe(201);

    const emailAlreadyInUseResponse = await signup().send({
      ...fixture,
      firstName: 'OtherFirst',
      lastName: 'OtherLast',
      password: '87654321',
    });
    expect(emailAlreadyInUseResponse.status).toBe(409);
    expect(emailAlreadyInUseResponse.body).toEqual({
      message: 'Email is already in use.',
    });

    const accountsWithEmail = await Account.find({
      email: fixture.email,
    }).lean();
    expect(accountsWithEmail.length).toBe(1);
  });

  it('should not create an account if email is not valid', async () => {
    const invalidEmail = 'some-invalid-email';

    const response = await signup().send({ ...fixture, email: invalidEmail });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid email.' });

    const accountWasCreated = await Account.exists({ email: invalidEmail });
    expect(accountWasCreated).toBe(false);
  });

  it('should not create an account if password is not 8-characters long', async () => {
    const passwordTooShortResponse = await signup().send({
      ...fixture,
      password: '1234567',
    });

    expect(passwordTooShortResponse.status).toBe(400);
    expect(passwordTooShortResponse.body).toEqual({
      message: 'Password too short.',
    });

    const accountWasCreated = await Account.exists({ email: fixture.email });
    expect(accountWasCreated).toBe(false);
  });

  it('should not create an account if any required fields are empty or missing', async () => {
    const errorResponses = await Promise.all([
      signup().send({ firstName: '', lastName: '', email: '' }),
      signup().send({}),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid or missing required field(s).',
      });
    });

    const accountsWereCreated = await Account.exists({
      email: { $in: ['', undefined, null] },
    });
    expect(accountsWereCreated).toBe(false);
  });
});
