const fs = require('fs');
const path = require('path');

function getTranslitedWord(locale = 'en', word = '') {
  const dictionary = JSON.parse(fs.readFileSync(path.join(__dirname, `/dictionary.json`), 'utf-8'));

  const translitedWord = dictionary[locale][word];
  return translitedWord === undefined ? word : translitedWord;

}

module.exports = getTranslitedWord;
