import request from 'supertest';

import app from '~/app';
import database from '~/database';
import Account from '~/models/Account';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/signup` endpoint', () => {
  const fixture = {
    firstName: 'First',
    lastName: 'Last',
    email: 'account@example.com',
    password: '12345678',
  };

  beforeEach(() => Account.deleteMany({}));

  it('should support creating new accounts', async () => {
    const response = await request(app).post('/accounts/signup').send(fixture);

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
  });

  it('should not create an account if email already exists', async () => {
    const response = await request(app).post('/accounts/signup').send(fixture);
    expect(response.status).toBe(201);

    const emailAlreadyInUseResponse = await request(app)
      .post('/accounts/signup')
      .send({
        ...fixture,
        firstName: 'OtherFirst',
        lastName: 'OtherLast',
        password: '87654321',
      });
    expect(emailAlreadyInUseResponse.status).toBe(409);
    expect(emailAlreadyInUseResponse.body).toEqual({
      message: 'Email is already in use.',
    });

    const accountsWithEmail = await Account.find({ email: fixture.email });
    expect(accountsWithEmail.length).toBe(1);
  });
});
