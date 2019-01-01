const apiCodes = require('../../utils/settings/APICODES.json');

const structuredApiCodes = {};

apiCodes.forEach((code, apiCode) => {
  const middlware = (res, statusClarification = code.text.en) => res.status(code.codeStatus).json({
    apiCode,
    statusClarification
  });


  structuredApiCodes[code.title] = middlware;
  structuredApiCodes[apiCode] = middlware; // remove after refract
});

module.exports = structuredApiCodes;
