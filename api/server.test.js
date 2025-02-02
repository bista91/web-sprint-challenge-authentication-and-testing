const request = require('supertest');
const { server, httpServer } = require('./server.js')
const db = require ('../data/dbConfig.js')


describe('Auth API Tests', () => {
  beforeEach(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  // Test Registration
  it('should register a user', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: 'Captain Marvel',
      password: 'foobar',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'Captain Marvel');
  });

  // Test Login
  it('should login a user and return a token', async () => {
    await request(server).post('/api/auth/register').send({
      username: 'Captain Marvel',
      password: 'foobar',
    });
    const res = await request(server).post('/api/auth/login').send({
      username: 'Captain Marvel',
      password: 'foobar',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test Jokes Access (with token)
  it('should access jokes when logged in', async () => {
    const registerRes = await request(server).post('/api/auth/register').send({
      username: 'Captain Marvel',
      password: 'foobar',
    });
    const loginRes = await request(server).post('/api/auth/login').send({
      username: 'Captain Marvel',
      password: 'foobar',
    });

    const token = loginRes.body.token;
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', token);
    expect(jokesRes.status).toBe(200);
    expect(jokesRes.body).toHaveLength(3);
  });
});

// Test setup
beforeAll(() => {
  // Any setup if required
});

afterAll(done => {
  httpServer.close(done);  // Close the http server after all tests are done
});

describe('Auth API Tests', () => {
  // Your test cases here
});