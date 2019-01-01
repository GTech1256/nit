const uuid = require('uuid/v4');

module.exports = {
  getPayloadForAuth(user) {
    if (!user) {
      throw new Error('parameters not setted');
    };
    return {
      sub: user.email,
      username: user.username,
      address: user.wallet.address,
      roles: user.roles
    };
  },
  getRefreshToken(user) {
    if (!user) {
      throw new Error('parameters not setted');
    };
    return `${uuid()}_${user.wallet.address}`;
  }
};
