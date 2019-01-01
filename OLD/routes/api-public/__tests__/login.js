const app = require('app')
const request = require("supertest");

describe("API Public login test", () => {

  // test run in ./__tests__/authLogin.js
  it.skip('login.post(/) return user token with status 200', (done) => {
    request(app)
      .post('/api/public/login/')
      .send({
        email: 'voin.ics@yandex.ru',
        password: 'QGpbrPeBSzmim9A9HeHrvCEWn'
      })
      .expect(response => {
        expect(response.status).toBe(200);
        expect(response.body.token).not.toBeUndefined();
      })
      .end(done);
  });

  // test run in ./__tests__/authLogin.js
  it.skip('login.post(/) return status 403 by bad email', (done) => {

  });

  // test run in ./__tests__/authLogin.js
  it.skip('login.post(/) return status 403 by bad pass for email', (done) => {
    request(app)
      .post('/api/public/login/')
      .send({
        email: 'voin.ics@yandex.ru',
        password: '123456'
      })
      .expect(response => {
        expect(response.status).toBe(403);
      })
      .end(done);
  });


})
