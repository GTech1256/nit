const request = require('supertest')
const authorizedApp = require('authorized_app');

const pageOfPagination = 1;

describe('Test of api-private/sale.js', () => {

  it('shoult return error due of JoiMiddleware /planets:page', () => {
    return authorizedApp
      .get(`/api/private/sale/planets/${pageOfPagination}`)
      .expect(400);
  });

  it('shoult return planet for sale /planets:page', () => {
    return authorizedApp
      .get(`/api/private/sale/planets/${pageOfPagination}`)
      .query({ address: 'TCSLIACFHJVGRTU443IRJMXYISFKZJWMPPF2LE6U'  })
      .expect(response => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('planets');
        expect(response.body).toHaveProperty('fee');
        expect(response.body).toHaveProperty('totalCount');
        expect(response.body).toHaveProperty('pageLimit');
        expect(response.body).toHaveProperty('page');
      });
  });

});
