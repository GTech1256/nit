const app = require('app')
const request = require("supertest");

describe("API Public Galaxy test", () => {
  it('galaxy.get(/star/:galaxyId) return planets with status 200', (done) => {

    request(app)
      .get('/api/public/galaxy/star/0')
      .expect(200)
      .expect(response => {
        expect(response.body.length).toBe(100);
      })
      .end(done);
  });

  it('galaxy.get(/star/:galaxyId) not return planets and give status 400 with apiCode 5', (done) => {

    request(app)
      .get('/api/public/galaxy/star/-1')
      .expect(400)
      .expect(response => {
        expect(response.body.apiCode).toBe(5);

      })
      .end(done);
  });

  it("galaxy.get('/planets/) return planets with status 200", done => {
    request(app)
      .get('/api/public/galaxy/planets')
      .query({
        x: 2200,
        y: 1,
        z: -42400
      })
      .expect(200)
      .expect(response => {
        expect(response.body.length).toBe(12);
      })
      .end(done)
  })

})
