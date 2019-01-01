const app  = require('app');
const request = require('supertest')
const res = require('res');
const config = require('../config/appconfig').default;

describe("test ./index", () => {
  it('should return 404 - "API resource does not exist on specified route" on not valid url of API', () => {
    return request(app).get('/api/NOTVALIDEURL').expect(404);
  });

  it('should return file of SPA ', () => {
    return request(app).get('/login').expect(200);
  });

  it('should return file of pug ', () => {
    return request(app).get('/game').expect(200);
  });

});
