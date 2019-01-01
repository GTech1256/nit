module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      statusClarification: 'user is not authorized for using API'
    });
  }
  return next();
}
