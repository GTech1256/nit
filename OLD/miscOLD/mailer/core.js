const { mailgun: mailgunConfig } = require('../../config/appconfig').default;
const mailgun = require('mailgun-js')({
  apiKey: mailgunConfig.apiKey,
  domain: mailgunConfig.domain
});


module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      try {
        mailgun.messages().send({ from, subject, to, html }, (err, body) => {
          if (err) reject(err);
          resolve(body);
        });
      } catch(e) {
        reject(e);
      }
    });
  }
};
