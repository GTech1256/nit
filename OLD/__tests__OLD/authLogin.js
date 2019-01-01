const app = require('app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('../config/appconfig').default;
const User = require('../utils/models/user').default;

const validUserData = {
  email: 'hhz71251@molms.com',
  password: '123456'
};

const dataForSignJWT = {
  sub: validUserData.email,
  username: 'delacc',
  address: 'TCSLIACFHJVGRTU443IRJMXYISFKZJWMPPF2LE6U',
  roles: ['user']
};

const loginAPIUrl = '/api/public/login';
const authRefreshAPIUrl = '/api/public/auth/refresh';

describe('logic of auth correct', () => {
  it('User can succesfully login', () => {
    return request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(response => {
        expect(response.status).toBe(200);
        expect(typeof response.body.token).toBe('string');
        expect(typeof response.body.refreshToken).toBe('string');
      });
  });

  it('User gets 403 on invalid credentials', () => {
    return request(app)
      .post(loginAPIUrl)
      .send({
        email: 'hhz71251@molms.com',
        password: 'INVALID'
      })
      .expect(403);
  });

  it('User receives 401 on expired token', () => {
    const exporedToken = jwt.sign(dataForSignJWT, config.secretOrKey, {expiresIn: '1ms'});

    return request(app)
      .get('/api/private/account/info')
      .set('Authorization', `Bearer ${exporedToken}`)
      .expect(401);
  });

  it('User get new access token using refresh token', async () => {
    const { body: { token, refreshToken } } = await request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(200);

      return request(app)
        .post(authRefreshAPIUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({ refreshToken })
        .expect(response => {
          expect(response.status).toBe(200);
          expect(typeof response.body.token).toBe('string');
          expect(typeof response.body.refreshToken).toBe('string');
          expect(typeof response.body.token).not.toBe(token);
          expect(typeof response.body.refreshToken).not.toBe(refreshToken);
        });


  });

  it('User get 404 on invalid refresh token', async () => {

    const { body: { token } } = await request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(200);

    return request(app)
      .post(authRefreshAPIUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken: 'invalid' })
      .expect(response => {
        expect(response.status).toBe(404);
      });


  });


  it('User can use refresh token only once', async () => {
    const { body: { refreshToken, token } } = await request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(200);

    const { body: { refreshToken: newRefresh, token: newToken } } = await request(app)
        .post(authRefreshAPIUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({ refreshToken })
        .expect(response => {
          expect(response.status).toBe(200);
          expect(typeof response.body.token).toBe('string');
          expect(typeof response.body.refreshToken).toBe('string');
        });

      return request(app)
        .post(authRefreshAPIUrl)
        .set('Authorization', `Bearer ${token}`)
        .send({ refreshToken })
        .expect(404);
  })
  it('Refresh tokens become invalid on logout', async () => {
    const { body: { token, refreshToken } } = await request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(200);

    await request(app)
      .post('/api/private/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    return request(app)
      .post(authRefreshAPIUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken })
      .expect(404);
  });
  it('Multiple refresh tokens are valid', async () => {
    const { body: { token: firstToken, refreshToken: firstRefreshToken } } = await request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(200);

    const { body: { token: secondToken, refreshToken: secondRefreshToken } } = await request(app)
      .post(loginAPIUrl)
      .send(validUserData)
      .expect(200);

    await request(app)
        .post(authRefreshAPIUrl)
        .set('Authorization', `Bearer ${firstToken}`)
        .send({ refreshToken: firstRefreshToken })
        .expect(response => {
          expect(response.status).toBe(200);
          expect(typeof response.body.token).toBe('string');
          expect(typeof response.body.refreshToken).toBe('string');
        });
    return request(app)
        .post(authRefreshAPIUrl)
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ refreshToken: secondRefreshToken })
        .expect(response => {
          expect(response.status).toBe(200);
          expect(typeof response.body.token).toBe('string');
          expect(typeof response.body.refreshToken).toBe('string');
        });
  });
})
