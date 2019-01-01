const request = require('supertest')
const authorizedApp = require('authorized_app');

describe("Test if api-private/store.js", () => {

  it("should joi reject", async () => {

    return authorizedApp.post('/api/private/store/planets/id/00007_0001p4_000001-000wps')
      .send({
        lou: 1 // lou should be string
      })
      .expect(400)

  })

  it("should return an error due to a bad planet ID", async () => {

    return authorizedApp.post('/api/private/store/planets/id/INVALID')
      .send({
        lou: '0'
      })
      .expect(400)
  })

  it("should return 403 due to planet owner changed", async () => {

    return authorizedApp.post('/api/private/store/planets/id/00007_0001p4_000001-000wps')
      .send({
        lou: '55'
      })
      .expect(403)
  })


  it("should buy planet", async () => {

    return authorizedApp.post('/api/private/store/planets/id/00007_0001p4_000001-000wps')
      .send({
        lou: '0'
      })
      .expect(200)
  })
})
