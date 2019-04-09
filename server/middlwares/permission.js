export default accessRoles => (ctx, next) => {
  if (!ctx.state.user) {
    return ctx.throw(401); // authorization needed
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const role of accessRoles) {
    if (ctx.state.user.roles.include(role)) {
      return next(); // success
    }
  }

  return ctx.throw(403); // permission denied
};
