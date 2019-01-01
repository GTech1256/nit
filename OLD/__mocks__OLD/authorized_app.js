const app = require('../index').app;
const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('../config/appconfig').default;

const dataForSignJWT = {
  sub: 'hhz71251@molms.com',
  username: 'delacc',
  address: 'TCSLIACFHJVGRTU443IRJMXYISFKZJWMPPF2LE6U',
  roles: ['user']
};

const exporedToken = jwt.sign(dataForSignJWT, config.secretOrKey, { expiresIn: '1day' });

module.exports = {
  post: (url) => request(app)
    .post(url)
    .set('Authorization', `Bearer ${exporedToken}`),
  get: (url) => request(app)
    .get(url)
    .set('Authorization', `Bearer ${exporedToken}`),
  dataForSignJWT
};
