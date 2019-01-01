const recaptchaResultMiddleware = require('../recaptchaResultMiddleware');
const config = require('../../config/appconfig').default;
const res = require('res');

const next = jest.fn();

describe("test ./middleware/recaptchaResultMiddleware", () => {
  it('should return true for DEV or TEST env', () => {
    const req = {
      body: {
        recaptcha: 'test'
      }
    }

    recaptchaResultMiddleware(req, res, next);

    expect(req.body.recapctcha).toBeTruthy();
  })

  it('should return message reCAPCTCHA not transferred if captcha undefined', async () => {

    const req = {
      body: {
      }
    }

    process.env.NODE_ENV = config.NODE_ENV.prod;
    const result = await recaptchaResultMiddleware(req, res, next);
    process.env.NODE_ENV = config.NODE_ENV.test;

    expect(result["Status Code"]).toBe(400);

  });

  it('should return error from request to Google with bad reCAPTCHA in request', async () => {

    const req = {
      body: {
        recaptcha: 'test'
      }
    }

    process.env.NODE_ENV = config.NODE_ENV.prod;
    const result = await recaptchaResultMiddleware(req, res, next);
    process.env.NODE_ENV = config.NODE_ENV.test;

    expect(result["Status Code"]).toBe(400);

  })

})
