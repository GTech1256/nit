const apiCodes = require('./apiCodes');

module.exports = (allowRoles, requestAllRoles = false) => {
  return (req, res, next) => {
    const haveAcces = requestAllRoles ?
      didHasAllPermissions(allowRoles, req.user.roles) :
      didHasOnePermission(allowRoles, req.user.roles);

    if (haveAcces) {
      next();
    } else {
      return apiCodes[19](res);
    }
  }
}


function didHasOnePermission(allowRoles, userRoles) {
  return allowRoles.some(role => userRoles.includes(role))
}

function didHasAllPermissions(allowRoles, userRoles) {
  return allowRoles.every(role => userRoles.includes(role))
}
