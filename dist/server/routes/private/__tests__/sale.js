"use strict";

var request = require('supertest');

var authorizedApp = require('authorized_app');

var pageOfPagination = 1;
describe('Test of api-private/sale.js', function () {
  it('shoult return error due of JoiMiddleware /planets:page', function () {
    return authorizedApp.get("/api/private/sale/planets/".concat(pageOfPagination)).expect(400);
  });
  it('shoult return planet for sale /planets:page', function () {
    return authorizedApp.get("/api/private/sale/planets/".concat(pageOfPagination)).query({
      address: 'TCSLIACFHJVGRTU443IRJMXYISFKZJWMPPF2LE6U'
    }).expect(function (response) {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('planets');
      expect(response.body).toHaveProperty('fee');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('pageLimit');
      expect(response.body).toHaveProperty('page');
    });
  });
});