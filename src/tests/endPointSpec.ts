import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('GET /api/images', () => {
  it('should return 400 if required query parameters are missing', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
  });

  it('should return 200 for valid query parameters', async () => {
    const response = await request.get('/api/images?filename=test&width=100&height=100');
    expect(response.status).toBe(200);
  });
});
