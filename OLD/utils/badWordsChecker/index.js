import badWords from './badWords.json';

export default (wordForCheck) => {
  if (!wordForCheck) {
    return true;
  }
  return badWords.indexOf(wordForCheck.toLowerCase()) !== -1;
};
