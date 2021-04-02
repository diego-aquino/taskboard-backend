import database from '~/database';

beforeAll(database.connect);
afterAll(database.disconnect);

describe('Sample test', () => {
  it('should run successfully', () => {
    expect(2 + 2).toBe(4);
  });
});
