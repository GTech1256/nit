function getHiddenUserEmail(email) {
  const [name, domain] = email.split('@');

  const nonStarWords = Math.round(name.length / 2);
  const nameWithStars = name.substring(0, nonStarWords) + '*'.repeat(name.length - nonStarWords);

  return `${nameWithStars}@${domain}`;
}

module.exports = {
  getHiddenUserEmail
}
