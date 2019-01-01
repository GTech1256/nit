const is_not_authenticated = require('../is-not-authenticated');
const res = require('res');

describe("test ./middleware/is-authenticated", () => {
  it('should call function next for not auth user', () => {
    const req = {};
    const next = jest.fn();

    is_not_authenticated(req, res, next);

    expect(next).toBeCalled();

  })

  it('should return status code 403', () => {

    const req = {
      user: true
    };
    const next = jest.fn();

    const response = is_not_authenticated(req, res, next);

    expect(response['Status Code']).toBe(403);

  })

})
