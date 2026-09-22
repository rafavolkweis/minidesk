const request = require('supertest');
const app = require('./server');

describe('Testes API - Parte 3', () => {
  it('GET / deve retornar status ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /usuarios deve retornar array', async () => {
    const res = await request(app).get('/usuarios');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});