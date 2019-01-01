const axios = require('axios');
const config = require('../config/appconfig').default;
const apiCodes = require('../misc/apiCodes');

module.exports = async (req, res, next) => {

  if (process.env.NODE_ENV !== config.NODE_ENV.prod) {
    req.body.recaptcha = true
    return next()
  }

  if (req.body.recaptcha === undefined) {
    return apiCodes[11](res, 'reCAPTCHA not transferred');
  };

  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_TOKEN}&response=${req.body.recaptcha}`;

  try {
    const { data: response } = await axios.post(verificationURL);

    if (!response.success) {
      return apiCodes[11](res);
    };

    req.body.recaptcha = response.success;
    next();
  } catch(err) {
    return apiCodes[11](res) // next();
  }
/*
  await axios
    .post(verificationURL)
    .then((recaptchaResult) => {
      if (!recaptchaResult.data.success) {
        return apiCodes[11](res);
      };

      req.body.recaptcha = recaptchaResult.data.success;

      next();

    });
    */
}
