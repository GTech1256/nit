const roleProtector = require('../roleProtector');
const res = require('res');

describe("test misc/roleProtector", () => {
  it("should let admin", () => {
    const allowRoles = ['admin'];
    const next = jest.fn();
    const req = {
      user: {
        roles: ['admin']
      }
    };

    roleProtector(allowRoles)(req, res, next);

    expect(next.mock.calls.length).toBe(1);
  })

  it("should not let user", () => {
    const allowRoles = ['partner'];
    const next = jest.fn();
    const req = {
      user: {
        roles: ['user']
      }
    };

    const response = roleProtector(allowRoles)(req, res, next);

    expect(next.mock.calls.length).toBe(0);
    expect(response['Status Code']).toBe(403);
  })
})
