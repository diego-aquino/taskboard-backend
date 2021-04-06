import request from 'supertest';

import app from '~/app';
import database from '~/database';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('Sample "/hello" endpoint', () => {
  it('should return a "Hello world!" message', async () => {
    const response = await request(app).get('/hello');
    expect(response.body).toEqual({ message: 'Hello world!' });
  });
});
