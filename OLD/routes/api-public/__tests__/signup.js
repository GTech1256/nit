require('dotenv').config();
require('../../../utils/mongo/database');

const app = require('app')
const request = require("supertest");
const User = require('../../../utils/models/user').default;

const userData = {
  username: 'testName',
  email: 'test@mail.ru',
  password: '123456',
  confirmationPassword: '123456'
};


describe('Test if api-public/signup.js', async () => {

  beforeEach(async () => {
    await User.remove({ email: userData.email });
  })

  it('should create user without referal', () => {
    return request(app)
      .post('/api/public/signup/')
      .send(userData)
      .expect(200);
  })

  it('should return error due to non unique email', () => {
    return request(app)
      .post('/api/public/signup/')
      .send({
        ...userData,
        email: 'voin.ics@yandex.ru'
      })
      .expect(400);
  })

  it('should return error due to non unique username', () => {
    return request(app)
      .post('/api/public/signup/')
      .send({
        ...userData,
        username: 'yandex'
      })
      .expect(400);
  })

  it('should not resend verify message due to invalid email', () => {
    return request(app)
      .post('/api/public/signup/resend/')
      .send({
        email: userData.email
      })
      .expect(404);
  })
})
