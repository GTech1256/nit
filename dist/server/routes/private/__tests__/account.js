"use strict";

var request = require('supertest');

var authorizedApp = require('authorized_app');

describe('Test of api-private/account.js', function () {
  it('shoult return error due of bad user roles for /test', function () {
    return authorizedApp.get('/api/private/account/test').expect(403);
  });
  it('shoult return info about user for /info', function () {
    return authorizedApp.get('/api/private/account/info').expect(function (response) {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('sumOfPopulations');
      expect(response.body).toHaveProperty('sumOfCost');
    });
  });
  it('shoult return error from JoiMiddleware for /transaction', function () {
    return authorizedApp.get('/api/private/account/transactions').expect(400);
  });
  it('shoult return txHistory of user for /transaction', function () {
    return authorizedApp.get('/api/private/account/transactions').query({
      username: authorizedApp.dataForSignJWT.username
    }).expect(function (response) {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('transactions');
    });
  });
  it('shoult return referals of user for /referals', function () {
    return authorizedApp.get('/api/private/account/referals').expect(function (response) {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('dataOfReferals');
      expect(response.body).toHaveProperty('dataOfProfit');
    });
  });
});