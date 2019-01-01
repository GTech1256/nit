const apiCodes = require('../apiCodes');
const res = require('res');

describe("test misc/apiCodes", () => {

  it('should return apiCode 0 with default text', () => {
    const apiCode = 0;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 200,
      body: JSON.stringify({
        apiCode,
        statusClarification: ''
      })
    })
  })

  it('should return apiCode 1 with default text', () => {
    const apiCode = 1;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 500,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'Error on the server. We\'ll fix it soon enough.'
      })
    })
  })

  it('should return apiCode 2 with default text', () => {
    const apiCode = 2;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'Email or password entered incorrectly'
      })
    })
  })

  it('should return apiCode 3 with default text', () => {
    const apiCode = 3;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'This mail is already busy.'
      })
    })
  })

  it('should return apiCode 4 with default text', () => {
    const apiCode = 4;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'Username must be unique.'
      })
    })
  })

  it('should return apiCode 5 with default text', () => {
    const apiCode = 5;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'The entered data did not pass validation.'
      })
    })
  })

  it('should return apiCode 6 with default text', () => {
    const apiCode = 6;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'The token for confirming account changes has not been received'
      })
    })
  })

  it('should return apiCode 7 with default text', () => {
    const apiCode = 7;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 404,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'user not found'
      })
    })
  })

  it('should return apiCode 8 with default text', () => {
    const apiCode = 8;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 404,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'not valid token'
      })
    })
  })

  it('should return apiCode 9 with default text', () => {
    const apiCode = 9;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'The requested galaxy was not found.'
      })
    })
  })

  it('should return apiCode 10 with default text', () => {
    const apiCode = 10;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'user not submit email'
      })
    })
  })

  it('should return apiCode 11 with default text', () => {
    const apiCode = 11;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'reCAPTCHA failed validation'
      })
    })
  })

  it('should return apiCode 12 with default text', () => {
    const apiCode = 12;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'insufficient balance'
      })
    })
  })

  it('should return apiCode 13 with default text', () => {
    const apiCode = 13;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'Old password is not correct'
      })
    })
  })

  it('should return apiCode 14 with default text', () => {
    const apiCode = 14;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 400,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'The requested planet not found'
      })
    })
  })

  it('should return apiCode 15 with default text', () => {
    const apiCode = 15;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'The requested planet does not belong to the user'
      })
    })
  })

  it('should return apiCode 16 with default text', () => {
    const apiCode = 16;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'Planet is currently being sold or is not belong to user'
      })
    })
  })

  it('should return apiCode 17 with default text', () => {
    const apiCode = 17;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'Planet is currently not being sold'
      })
    })
  })

  it('should return apiCode 18 with default text', () => {
    const apiCode = 18;
    const response = apiCodes[apiCode](res);

    expect(response).toEqual({
      ['Status Code']: 403,
      body: JSON.stringify({
        apiCode,
        statusClarification: 'The owner changed the ad'
      })
    })
  })

})
