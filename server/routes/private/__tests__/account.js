const request = require('supertest')
const authorizedApp = require('authorized_app');

describe('Test of api-private/account.js', () => {

  it('shoult return error due of bad user roles for /test', () => {
    return authorizedApp
      .get('/api/private/account/test')
      .expect(403)
  });

  it('shoult return info about user for /info', () => {
    return authorizedApp
      .get('/api/private/account/info')
      .expect((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('sumOfPopulations');
        expect(response.body).toHaveProperty('sumOfCost');
      })
  });

  it('shoult return error from JoiMiddleware for /transaction', () => {
    return authorizedApp
      .get('/api/private/account/transactions')
      .expect(400);
  });

  it('shoult return txHistory of user for /transaction', () => {
    return authorizedApp
      .get('/api/private/account/transactions')
      .query({ username: authorizedApp.dataForSignJWT.username })
      .expect((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('transactions');
      })
  });

  it('shoult return referals of user for /referals', () => {
    return authorizedApp
      .get('/api/private/account/referals')
      .expect((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('dataOfReferals');
        expect(response.body).toHaveProperty('dataOfProfit');
      });
  });

})
