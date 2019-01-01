const config = require('../../config/appconfig').default;
const mailer = require('./core');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const log = require('../../utils/logger/logger').default;
/*

@{param} locale Обычно передается из req.cookies.locale
@{param} emailType тип отправляемового сообщения (registration|restore...)
@{param} ejsData данные для подстановки в ejs
@{param} userEmail почта пользователя
@{param} payload нажно для подстановки значений вместо %type% и _ в getEmailHead()
 */
async function sendEmail(locale, emailType, ejsData, userEmail, payload) {

  console.log(Object.keys(log))
  if (!locale) {
    // log.error('locale not exist, setted \`en\` ' + emailType);
    console.error('locale not exist, setted \`en\` ' + emailType);
    locale = 'en';
  }


  if (emailType === undefined || userEmail === undefined) throw new Error('param emailType or userEmail not set');
  const htmlForRender = fs.readFileSync(path.join(__dirname, `/messages/${locale}/${emailType}.ejs`), 'utf-8');

  const emailHead = getEmailHead();

  const html = ejs.render(htmlForRender, ejsData);

  await mailer.sendEmail(config.mail.user, userEmail, emailHead, html);

  function getEmailHead() {
    const emailHeads = JSON.parse(fs.readFileSync(path.join(__dirname, `/messages/emailHead.json`), 'utf-8'));

    return replacer();


    /*
     *   "%type%" -> ${payload.key}
     *   "_" -> " "
     * Смена_%type% .replace (%type% ->  password) -> Смена пароля || Смена.
     */
    function replacer() {
      const type = payload ? emailHeads[locale].actions[payload.key] : '';
      const space = payload ? ' ' : '';

      return emailHeads[locale][emailType]
        .replace('%type%', type)
        .replace('_', space);
    }

  }

}




module.exports = sendEmail
