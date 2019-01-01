const app = require('app')
const request = require("supertest");

describe("API Public Store test", () => {
  // fix $text: { $search: req.resultOfJoiValidate.value.query }

  it('store.get(/planets/search) return planets by name with status 200', (done) => {

    request(app)
      .get('/api/public/store/planets/search')
      .query({
        query: 'Eabeo Psi',
        page: 1
      })
      .expect(200)
      .expect(response => {
        // console.log(response.body)
        expect(response.body.length).toBe(1);
      })
      .end(done);
  });
  it('store.get(/planets/:page) return planets in page 1 with query', (done) => {
    const page = 1;
    request(app)
      .get(`/api/public/store/planets/${page}`)
      .query({
        price: "0-500",
        population: "0-4000",
        sort: "price-d",
        type: "0,1,2,3,4,5,6"
      })
      .expect(response => {
        expect(response.status).toBe(200);
        expect(response.body.planets.length).toBeGreaterThanOrEqual(0);
        expect(response.body.page).toBe(page);
      })
      .end(done);
  });

  it('store.get(/planets/id/:id) return planet by planetID', (done) => {
    const planetID = '00001_0001p4_000001-000wps';
    request(app)
      .get(`/api/public/store/planets/id/${planetID}`)
      .expect(response => {
        const { planet } = response.body
        expect(response.status).toBe(200);
        expect(planet).not.toBeUndefined();
        expect(response.body.fee).not.toBeUndefined();
        expect(planet.id).toBe(planetID);
      })
      .end(done);
  });

  it('store.get(/planets/id/:id) return status code 400 by bad planetID', (done) => {
    const planetID = '00001_s';
    request(app)
      .get(`/api/public/store/planets/id/${planetID}`)
      .expect(400)
      .end(done);
  });

});
