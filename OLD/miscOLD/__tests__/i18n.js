const i18n = require('../i18n');

describe("test misc/i18n", () => {
  it('should transtlate "password" to ru lang "пароля" ', () => {
    const locale = 'ru';
    const word = 'password';
    const expectWord = 'пароля';

    expect(i18n(locale, word)).toBe(expectWord);
  })

  it('should not transtlate "exeption" and return "exeption" ', () => {
    const locale = 'ru';
    const word = 'exeption';
    const expectWord = 'exeption';

    expect(i18n(locale, word)).toBe(expectWord);
  })

  it('should not transtlate "password" to en and return "password" ', () => {
    const locale = 'en';
    const word = 'password';
    const expectWord = 'password';

    expect(i18n(locale, word)).toBe(expectWord);
  })

})
