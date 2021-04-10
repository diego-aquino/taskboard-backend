import request from 'supertest';

import app from '~/app';
import database from '~/database';
import { Account } from '~/models';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('`/accounts/signup` endpoint', () => {
  const fixture = {
    firstName: 'First',
    lastName: 'Last',
    email: 'signup.account@example.com',
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

    const accountsWithEmail = await Account.find({
      email: fixture.email,
    }).lean();
    expect(accountsWithEmail.length).toBe(1);
  });

  it('should not create an account if email is not valid', async () => {
    const response = await request(app)
      .post('/accounts/signup')
      .send({ ...fixture, email: 'some-invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid email.' });

    const accountsCreated = await Account.find({}).lean();
    expect(accountsCreated.length).toBe(0);
  });

  it('should not create an account if password is not 8-characters long', async () => {
    const passwordTooShortResponse = await request(app)
      .post('/accounts/signup')
      .send({ ...fixture, password: '1234567' });

    expect(passwordTooShortResponse.status).toBe(400);
    expect(passwordTooShortResponse.body).toEqual({
      message: 'Password too short.',
    });

    const accountsCreated = await Account.find({}).lean();
    expect(accountsCreated.length).toBe(0);
  });

  it('should not create an account if any required fields are empty or missing', async () => {
    const errorResponses = await Promise.all([
      request(app).post('/accounts/signup').send({
        firstName: '',
        lastName: '',
        email: '',
      }),
      request(app).post('/accounts/signup').send({}),
    ]);

    errorResponses.forEach((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid or missing required field(s).',
      });
    });

    const accountsCreated = await Account.find({}).lean();
    expect(accountsCreated.length).toBe(0);
  });
});
