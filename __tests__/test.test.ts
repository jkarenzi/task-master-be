export {}
const request = require('supertest');
const app = require('../src/app');


describe('Test', () => {
  it('should return 200 successful upon testing route', async () => {
    const response = await request(app).get('/api/test')
    expect(response.status).toBe(200);
  });
});
