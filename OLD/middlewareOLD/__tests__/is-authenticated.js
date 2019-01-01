const is_authenticated = require('../is-authenticated');
const res = require('res');

describe("test ./middleware/is-authenticated", () => {
  it('should call function next for not auth user', () => {
    const req = {
      user: true
    };
    const next = jest.fn();

    is_authenticated(req, {}, next);

    expect(next).toBeCalled();

  })

  it('should call function res.status', () => {

    const req = {};
    const next = jest.fn();

    const response = is_authenticated(req, res, next);

    expect(response['Status Code']).toBe(401);

  })
})
